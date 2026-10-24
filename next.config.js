/** @type {import('next').NextConfig} */
module.exports = {
  // Redirect the legacy mail page at the routing layer so ordinary HTTP
  // clients receive a proper Location header (not only a rendered redirect boundary).
  async redirects() {
    return [
      {
        source: "/mail",
        destination: "/#communications",
        permanent: false,
      },
    ];
  },
  // Termux/Android cannot use native @next/swc-* binaries reliably.
  // Keep default SWC minify in real builds (Vercel/Linux).
  swcMinify: process.env.TERMUX !== "1",
};
