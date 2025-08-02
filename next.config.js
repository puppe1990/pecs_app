/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  experimental: {
    typedRoutes: true
  }
}

module.exports = nextConfig