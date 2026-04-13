/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Termux/Android is smoke-only; keep the Linux/Vercel SWC path for preview builds.
  swcMinify: process.env.TERMUX !== "1",
}

export default nextConfig
