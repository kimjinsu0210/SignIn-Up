/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        "array-flatten": false,
        "body-parser": false,
        accepts: false,
        net: false,
        async_hooks: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
