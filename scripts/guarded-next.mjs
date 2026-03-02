import { spawnSync } from "node:child_process";

function isTermuxOrAndroid() {
  const env = process.env;
  const prefix = env.PREFIX || "";
  return (
    !!env.TERMUX_VERSION ||
    prefix.includes("com.termux") ||
    !!env.ANDROID_ROOT ||
    process.platform === "android"
  );
}

const cmd = process.argv[2];
if (!cmd) {
  console.error("USAGE: node scripts/guarded-next.mjs <build|dev|start>");
  process.exit(2);
}

if (isTermuxOrAndroid()) {
  console.error(
    `TERMUX_GUARD_BLOCKED: next ${cmd} is disabled on Termux/Android. See docs/termux-smoke.md`
  );
  process.exit(42);
}

const r = spawnSync("npx", ["next", cmd], { stdio: "inherit" });
process.exit(r.status ?? 1);
