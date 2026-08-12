// Telegram notification — so a long-running task can reach the user when
// they're away from the computer.
//
// Usage:
//   node scripts/notify.mjs "Текст сообщения"
//   echo "Текст" | node scripts/notify.mjs
//
// Credentials come from the untracked .env at the repo root (see .gitignore):
//   BOT_TOKEN=...            required
//   TELEGRAM_CHAT_ID=...     required — whose chat with that bot to write into
//
// WHY THIS IS A NODE SCRIPT AND NOT A CURL ONE-LINER (docs/AGENT_OPERATIONS.md):
// passing non-ASCII text to curl through Git Bash on this machine mangles the
// encoding — Telegram rejects it with "strings must be encoded in UTF-8" —
// and the PowerShell tool is blocked in this environment. Node reads and posts
// UTF-8 correctly with no shell in the middle, which makes this the only path
// that reliably survives Cyrillic.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

function readEnv() {
  let raw;
  try {
    raw = readFileSync(join(repoRoot, ".env"), "utf8");
  } catch {
    throw new Error("No .env at the repo root — cannot send notifications.");
  }
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const match = /^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/i.exec(line);
    if (match) env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

async function readStdin() {
  if (process.stdin.isTTY) return "";
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8").trim();
}

const text = process.argv.slice(2).join(" ").trim() || (await readStdin());
if (!text) {
  console.error('Nothing to send. Usage: node scripts/notify.mjs "message"');
  process.exit(1);
}

const env = readEnv();
const token = env.BOT_TOKEN;
const chatId = env.TELEGRAM_CHAT_ID;

// Never print the token itself, only whether it's missing.
if (!token) throw new Error("BOT_TOKEN missing from .env");
if (!chatId) throw new Error("TELEGRAM_CHAT_ID missing from .env");

const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ chat_id: Number(chatId), text, disable_notification: false }),
});

const result = await response.json();
if (!result.ok) {
  // result never contains the token; safe to surface.
  console.error(`Telegram rejected it: ${result.error_code} ${result.description}`);
  process.exit(1);
}
console.log(`sent (message_id ${result.result.message_id})`);
