import { execFileSync } from "node:child_process";

function runTmux(args: string[]): string {
  return execFileSync("tmux", args, { encoding: "utf8" }).trim();
}

export function requireTmux(): void {
  try {
    execFileSync("tmux", ["-V"], { encoding: "utf8", stdio: "ignore" });
  } catch {
    throw new Error("tmux is required but was not found in PATH.");
  }
}

export function ensureSession(sessionName: string): void {
  try {
    runTmux(["has-session", "-t", sessionName]);
  } catch {
    runTmux(["new-session", "-d", "-s", sessionName, "-n", "shell"]);
  }
}

export function sanitizeWindowName(name: string, kind: "parent" | "subagent"): string {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return kind === "subagent" ? `subagent-${base}` : `parent-${base}`;
}

export function uniqueWindowName(sessionName: string, desiredName: string): string {
  const output = runTmux(["list-windows", "-t", sessionName, "-F", "#{window_name}"]);
  const existing = new Set(output.split(/\n+/).filter(Boolean));
  if (!existing.has(desiredName)) return desiredName;
  let i = 2;
  while (existing.has(`${desiredName}-${i}`)) i++;
  return `${desiredName}-${i}`;
}

export function newWindow(sessionName: string, windowName: string, command: string): void {
  runTmux(["new-window", "-t", sessionName, "-n", windowName, command]);
}
