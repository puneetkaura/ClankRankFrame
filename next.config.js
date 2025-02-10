/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Enable static exports for frame metadata
  generateEtags: true,
  poweredByHeader: false,
  // Configure headers for frame metadata
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'none'",
          },
        ],
      },
    ]
  },
}

export default nextConfig
