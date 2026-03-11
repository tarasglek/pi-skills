#!/usr/bin/env node
import { detectParentPi, extractSessionArg } from "./lib/process-tree.ts";
import { forkSessionFromLeaf, resolveSessionPath } from "./lib/pi-session.ts";
import { ensureSession, newWindow, requireTmux, sanitizeWindowName, uniqueWindowName } from "./lib/tmux.ts";

interface Args {
  name?: string;
  task?: string;
  tmuxSession: string;
  help: boolean;
}

function parseArgs(argv: string[]): Args {
  const args: Args = { tmuxSession: "pi-agents", help: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") args.help = true;
    else if (arg === "--name") args.name = argv[++i];
    else if (arg === "--task") args.task = argv[++i];
    else if (arg === "--tmux-session") args.tmuxSession = argv[++i] ?? args.tmuxSession;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function printHelp(): void {
  console.log(`Usage:\n  node pi-sub-agents.ts --name <agent-name> --task "<initial-task>" [--tmux-session pi-agents]\n`);
}

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

function remediation(): string {
  return [
    "Parent pi must be started with --session.",
    "In the parent pi, run:",
    "  /session",
    "  /name parent/<task>   # optional",
    "Then restart with:",
    "  deno run -A npm:@mariozechner/pi-coding-agent --session <id-or-path>",
    "Fallback if needed:",
    "  pi --session <id-or-path>",
    "Then rerun this helper.",
  ].join("\n");
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }
  if (!args.name || !args.task) {
    printHelp();
    throw new Error("Both --name and --task are required.");
  }

  requireTmux();
  const parent = await detectParentPi();
  const sessionArg = extractSessionArg(parent.argv);
  if (!sessionArg) {
    throw new Error(remediation());
  }

  const parentPath = await resolveSessionPath(sessionArg);
  const { childPath } = forkSessionFromLeaf(parentPath, args.name);

  ensureSession(args.tmuxSession);

  const parentWindow = uniqueWindowName(args.tmuxSession, sanitizeWindowName(args.name, "parent"));
  const childWindow = uniqueWindowName(args.tmuxSession, sanitizeWindowName(args.name, "subagent"));

  const cwd = parent.cwd ?? process.cwd();
  const launcher = "deno run -A npm:@mariozechner/pi-coding-agent";

  newWindow(args.tmuxSession, parentWindow, `cd ${shellQuote(cwd)} && ${launcher} --session ${shellQuote(parentPath)}`);
  newWindow(args.tmuxSession, childWindow, `cd ${shellQuote(cwd)} && ${launcher} --session ${shellQuote(childPath)} ${shellQuote(args.task)}`);

  console.log(`Started tmux session: ${args.tmuxSession}`);
  console.log(`Parent window: ${parentWindow}`);
  console.log(`Child window: ${childWindow}`);
  console.log("To monitor:");
  console.log(`  tmux attach -t ${args.tmuxSession}`);
  console.log("To list subagents:");
  console.log(`  tmux list-windows -t ${args.tmuxSession} | grep subagent`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
