/** @type {import('next').NextConfig} */
// Render's fromService resolves to a bare host (no scheme); local dev passes a full URL.
const rawApiUrl = process.env.API_URL || 'http://localhost:3002';
const apiUrl = (/^https?:\/\//i.test(rawApiUrl) ? rawApiUrl : `https://${rawApiUrl}`).replace(/\/+$/, '');

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
