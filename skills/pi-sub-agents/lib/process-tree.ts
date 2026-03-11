import find from "find-process";
import psList from "ps-list";

export interface PiParentProcess {
  pid: number;
  ppid: number;
  cmd: string;
  argv: string[];
  cwd?: string;
}

function splitCommand(command: string): string[] {
  const matches = command.match(/(?:"[^"]*"|'[^']*'|\S+)/g) ?? [];
  return matches.map((part) => part.replace(/^['"]|['"]$/g, ""));
}

function looksLikePi(argv: string[], command: string): boolean {
  const joined = `${argv.join(" ")} ${command}`;
  return joined.includes("pi-coding-agent") || /(^|\s)pi(\s|$)/.test(joined);
}

export async function detectParentPi(): Promise<PiParentProcess> {
  const currentPid = process.pid;
  const currentPpid = process.ppid;
  const processes = await psList();
  const byPid = new Map(processes.map((proc) => [proc.pid, proc]));

  const ancestry: number[] = [];
  let pid: number | undefined = currentPpid;
  while (pid && pid > 1) {
    ancestry.push(pid);
    pid = byPid.get(pid)?.ppid;
  }

  const candidates: PiParentProcess[] = [];
  for (const ancestorPid of ancestry) {
    const matches = await find("pid", ancestorPid);
    const match = matches[0];
    if (!match) continue;
    const cmd = match.cmd ?? match.name ?? "";
    const argv = splitCommand(cmd);
    if (!looksLikePi(argv, cmd)) continue;
    candidates.push({
      pid: ancestorPid,
      ppid: byPid.get(ancestorPid)?.ppid ?? 0,
      cmd,
      argv,
      cwd: process.cwd(),
    });
  }

  if (candidates.length === 0) {
    throw new Error("No confident parent pi process found in ancestry.");
  }
  if (candidates.length > 1) {
    throw new Error("Ambiguous parent pi process detection.");
  }
  if (candidates[0]?.pid === currentPid) {
    throw new Error("Detected current helper process instead of parent pi process.");
  }
  return candidates[0]!;
}

export function extractSessionArg(argv: string[]): string | undefined {
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--session") return argv[i + 1];
    if (arg?.startsWith("--session=")) return arg.slice("--session=".length);
  }
  return undefined;
}
