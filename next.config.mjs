/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep heavy / native server deps out of the bundle; load them at runtime.
  serverExternalPackages: ["@0gfoundation/0g-ts-sdk", "ethers"],
};

export default nextConfig;
