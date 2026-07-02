import { spawnSync } from "node:child_process";

function isTermuxOrAndroid() {
  const env = process.env;

  const prefix = env.PREFIX || "";

  const isTermux =
    !!env.TERMUX_VERSION ||
    prefix.includes("com.termux") ||
    !!env.ANDROID_ROOT;

  // 🔥 IMPORTANT FIX:
  // NEVER block CI systems like Vercel
  const isCI = !!process.env.VERCEL || !!process.env.CI;

  return isTermux && !isCI;
}

const cmd = process.argv[2];
if (!cmd) {
  console.error("USAGE: node scripts/guarded-next.mjs <build|dev|start>");
  process.exit(2);
}

if (isTermuxOrAndroid()) {
  console.error(
    \`TERMUX_GUARD_BLOCKED: next \${cmd} is disabled on Termux/Android. See docs/termux-smoke.md\`
  );
  process.exit(42);
}

const r = spawnSync("npx", ["next", cmd], { stdio: "inherit" });
process.exit(r.status ?? 1);
