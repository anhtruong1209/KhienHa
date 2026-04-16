import path from "node:path";
import { fileURLToPath } from "node:url";

const configRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: configRoot,
  },
};

export default nextConfig;
