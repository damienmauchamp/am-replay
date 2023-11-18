/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        // hostname: '**.mzstatic.com',
        // hostname: 'is1-ssl.mzstatic.com',
        // hostname: 'is2-ssl.mzstatic.com',
        // hostname: 'is3-ssl.mzstatic.com',
      }
    ]
  }
}

module.exports = nextConfig