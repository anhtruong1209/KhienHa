import path from "node:path";
import { fileURLToPath } from "node:url";

const configRoot = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.join(configRoot, "..");
const backendOrigin = (process.env.KHIENHA_BACKEND_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const isStaticExport = process.env.KHIENHA_FE_STATIC === "1";
const isDevelopment = process.env.NODE_ENV === "development";
const developmentRewrites = {
  async rewrites() {
    return [
      {
        source: "/api/public/:path*",
        destination: `${backendOrigin}/api/public/:path*`,
      },
      {
        source: "/api/admin/site-content",
        destination: `${backendOrigin}/api/admin/site-content`,
      },
      {
        source: "/api/admin/news/:path*",
        destination: `${backendOrigin}/api/admin/news/:path*`,
      },
      {
        source: "/api/admin/contact-messages/:path*",
        destination: `${backendOrigin}/api/admin/contact-messages/:path*`,
      },
      {
        source: "/storage/:path*",
        destination: `${backendOrigin}/storage/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backendOrigin}/uploads/:path*`,
      },
      {
        source: "/up",
        destination: `${backendOrigin}/up`,
      },
    ];
  },
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: isStaticExport ? "export" : "standalone",
  ...(isStaticExport
    ? {
        trailingSlash: true,
      }
    : {
        outputFileTracingRoot: workspaceRoot,
      }),
  ...(!isStaticExport && isDevelopment ? developmentRewrites : {}),
  turbopack: {
    root: workspaceRoot,
  },
};

export default nextConfig;
