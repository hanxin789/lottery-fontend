/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      "/": { page: "/" },
      "/about": { page: "/" },
      "/p/index": { page: "/" },
    }
  },
}

module.exports = {
  nextConfig,
  images: {
    unoptimized: true,
  },
}
