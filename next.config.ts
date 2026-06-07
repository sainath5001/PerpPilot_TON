import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TonConnect handshake is aborted when Strict Mode remounts providers mid-connect
  reactStrictMode: false,
};

export default nextConfig;
