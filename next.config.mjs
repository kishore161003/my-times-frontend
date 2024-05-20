/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["utfs.io", "img.clerk.com", "picsum.photos"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
