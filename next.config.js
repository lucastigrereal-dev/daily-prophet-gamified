/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: false, // Disable Turbopack due to Windows build issues
  },
  typescript: {
    // Treat TypeScript errors as warnings during build
    tsconfigPath: './tsconfig.json',
  },
};

module.exports = nextConfig;
