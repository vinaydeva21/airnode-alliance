/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    asyncWebAssembly: true,
    topLevelAwait: true,
  },
};

module.exports = nextConfig;
