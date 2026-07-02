import { spawnSync } from "node:child_process";

function shouldBlockTermux() {
  const env = process.env;

  const isTermux =
    !!env.TERMUX_VERSION ||
    (env.PREFIX || "").includes("com.termux");

  const isCI =
    !!env.CI ||
    !!env.VERCEL ||
    !!env.VERCEL_ENV;

  return isTermux && !isCI;
}

const cmd = process.argv[2];

if (!cmd) {
  console.error("USAGE: node guarded-next.mjs <dev|build|start>");
  process.exit(2);
}

if (shouldBlockTermux()) {
  console.error(
    `TERMUX_GUARD_BLOCKED: next ${cmd} is disabled on Termux/Android. See docs/termux-smoke.md`
  );
  process.exit(42);
}

const r = spawnSync("npx", ["next", cmd], { stdio: "inherit" });
process.exit(r.status ?? 1);
