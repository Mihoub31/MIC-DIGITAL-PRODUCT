/** @type {import('next').NextConfig} */
const apiUrl = (process.env.API_URL || 'http://localhost:3002').replace(/\/+$/, '');

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  // Without this, Next answers /api/* with a 308 to /api/*/ before the rewrite runs.
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
