import { SessionManager } from "@mariozechner/pi-coding-agent";

export interface ForkedSessionInfo {
  parentPath: string;
  childPath: string;
}

export async function resolveSessionPath(sessionArg: string): Promise<string> {
  if (sessionArg.includes("/") || sessionArg.endsWith(".jsonl")) {
    return sessionArg;
  }

  const sessions = await SessionManager.listAll();
  const exact = sessions.find((session) => session.id === sessionArg);
  if (exact) return exact.path;

  const partialMatches = sessions.filter((session) => session.id.startsWith(sessionArg));
  if (partialMatches.length === 1) return partialMatches[0]!.path;
  if (partialMatches.length > 1) throw new Error(`Ambiguous session id: ${sessionArg}`);
  throw new Error(`No session found for: ${sessionArg}`);
}

export function forkSessionFromLeaf(parentPath: string, childName: string): ForkedSessionInfo {
  const parent = SessionManager.open(parentPath);
  const leafId = parent.getLeafId();
  if (!leafId) throw new Error("Parent session has no leaf id.");

  const childPath = parent.createBranchedSession(leafId);
  if (!childPath) throw new Error("Failed to create branched child session.");

  const child = SessionManager.open(childPath);
  child.appendSessionInfo(childName);

  return { parentPath, childPath };
}
