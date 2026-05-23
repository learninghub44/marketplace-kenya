/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: '10mb' },
  },
  // Don't include webpack cache in output
  webpack: (config, { isServer }) => {
    config.cache = false
    return config
  },
}
module.exports = nextConfig
