/** @type {import('next').NextConfig} */
module.exports = {
  // Termux/Android cannot use native @next/swc-* binaries reliably.
  // Keep default SWC minify in real builds (Vercel/Linux).
  swcMinify: process.env.TERMUX !== "1",
};
