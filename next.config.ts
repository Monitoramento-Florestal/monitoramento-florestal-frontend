import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow dev-only HMR and other Next assets when the app is opened through
  // the local IP or an ngrok HTTPS tunnel during manual QA.
  allowedDevOrigins: [
    "26.255.182.166",
    "*.ngrok-free.dev",
    "*.ngrok-free.app",
    "*.ngrok.io",
    "*.ngrok.app",
  ],
};

export default nextConfig;
