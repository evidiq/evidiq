// Sync EVIDIQ's public mirror repos from THIS monorepo (the single source of truth).
//
//   evidiq/evidiq  (this repo)  ─┬─►  evidiq/mcp           (open MCP server)
//                                └─►  evidiq/evidiq-skill  (open Agent Skill)
//
// The mirrors are pure copies of a subset of this repo + a rendered SKILL.md.
// They have no auto-sync, so they used to drift. Run this after every deploy:
//
//   node scripts/sync-mirrors.mjs
//
// Reads GITHUB_TOKEN from .env.local (never printed). For each mirror it clones,
// copies the mapped files verbatim, renders SKILL.md from the live endpoint,
// commits only if something changed, and pushes. Safe to run repeatedly.

import { execFileSync } from "node:child_process";
import {
  mkdtempSync,
  rmSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const LIVE_SKILL_URL = "https://evidiq.dev/skill.md";

const TOKEN = (readFileSync(join(ROOT, ".env.local"), "utf8").match(
  /^GITHUB_TOKEN=(.+)$/m
) || [])[1]?.trim();
if (!TOKEN) {
  console.error("GITHUB_TOKEN not found in .env.local");
  process.exit(1);
}

// verbatim file copies: [ path in this monorepo, path in the mirror ]
const MIRRORS = {
  mcp: {
    files: [
      ["app/[transport]/route.ts", "route.ts"],
      ["lib/install.ts", "lib/install.ts"],
      ["lib/request-context.ts", "lib/request-context.ts"],
      ["lib/skill.ts", "lib/skill.ts"],
      ["lib/og/attest.ts", "lib/og/attest.ts"],
      ["lib/og/compute.ts", "lib/og/compute.ts"],
      ["lib/og/config.ts", "lib/og/config.ts"],
      ["lib/og/storage.ts", "lib/og/storage.ts"],
      ["lib/trust/probe.ts", "lib/trust/probe.ts"],
      ["lib/trust/score.ts", "lib/trust/score.ts"],
      ["lib/trust/types.ts", "lib/trust/types.ts"],
      ["lib/x402/challenge.ts", "lib/x402/challenge.ts"],
      ["lib/x402/config.ts", "lib/x402/config.ts"],
      ["lib/x402/facilitator.ts", "lib/x402/facilitator.ts"],
      ["lib/x402/gate.ts", "lib/x402/gate.ts"],
      ["lib/x402/settle.ts", "lib/x402/settle.ts"],
      ["lib/x402/types.ts", "lib/x402/types.ts"],
      ["lib/x402/verify.ts", "lib/x402/verify.ts"],
    ],
  },
  "evidiq-skill": {
    files: [
      ["lib/install.ts", "src/install.ts"],
      ["lib/skill.ts", "src/skill.ts"],
    ],
    renderSkill: true, // SKILL.md + skills/evidiq/SKILL.md from the live /skill.md
  },
};

function git(args, cwd, extraEnv) {
  return execFileSync("git", args, {
    cwd,
    env: extraEnv ? { ...process.env, ...extraEnv } : process.env,
    stdio: ["ignore", "pipe", "pipe"],
  }).toString();
}

let skillDoc = null;
async function renderedSkill() {
  if (skillDoc) return skillDoc;
  const res = await fetch(LIVE_SKILL_URL);
  const text = await res.text();
  if (!res.ok || !text.trimStart().startsWith("---")) {
    throw new Error(
      `live ${LIVE_SKILL_URL} returned unexpected content (deploy the monorepo first)`
    );
  }
  skillDoc = text;
  return text;
}

// Push credential helper reads the token from $GH_TOKEN — keeps it out of the
// remote URL, the stored config, and the process arg list.
const CRED_HELPER =
  '!f(){ echo username=x-access-token; echo "password=$GH_TOKEN"; };f';

for (const [repo, spec] of Object.entries(MIRRORS)) {
  const dir = mkdtempSync(join(tmpdir(), `sync-${repo}-`));
  console.log(`\n=== evidiq/${repo} ===`);
  try {
    git(["clone", "--depth", "1", `https://github.com/evidiq/${repo}.git`, dir]);

    for (const [src, dest] of spec.files) {
      const destPath = join(dir, dest);
      mkdirSync(dirname(destPath), { recursive: true });
      writeFileSync(destPath, readFileSync(join(ROOT, src), "utf8"));
    }
    if (spec.renderSkill) {
      const doc = await renderedSkill();
      writeFileSync(join(dir, "SKILL.md"), doc);
      mkdirSync(join(dir, "skills/evidiq"), { recursive: true });
      writeFileSync(join(dir, "skills/evidiq/SKILL.md"), doc);
    }

    git(["add", "-A"], dir);
    const status = git(["status", "--porcelain"], dir).trim();
    if (!status) {
      console.log("  already up to date");
      continue;
    }
    git(
      [
        "-c",
        "user.name=evidiq-sync",
        "-c",
        "user.email=sync@evidiq.dev",
        "commit",
        "-q",
        "-m",
        "chore: sync from evidiq/evidiq monorepo",
      ],
      dir
    );
    git(["-c", `credential.helper=${CRED_HELPER}`, "push", "origin", "HEAD:main"], dir, {
      GH_TOKEN: TOKEN,
    });
    console.log("  pushed. changed files:\n" + status.replace(/^/gm, "    "));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
console.log("\nMirrors in sync.");
