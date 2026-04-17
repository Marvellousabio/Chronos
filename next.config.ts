import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add empty turbopack config to avoid conflict
  turbopack: {},

  // Keep webpack for transpilation
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    // Transpile D3 packages for client-side compatibility
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/d3/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
    });
    return config;
  },
};

export default nextConfig;
