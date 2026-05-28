import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

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
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
