import type { NextConfig } from "next";

// Dual-mode configuration:
// - Dev / preview (default): standalone output used by the sandbox runtime.
// - GitHub Pages export: CI sets NEXT_OUTPUT=export and
//   NEXT_PUBLIC_BASE_PATH=/REPOSITORY_NAME so the static site works under
//   https://USERNAME.github.io/REPOSITORY_NAME/ (see .github/workflows/deploy.yml).
const isExport = process.env.NEXT_OUTPUT === "export";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(isExport ? { output: "export" as const } : { output: "standalone" as const }),
  basePath: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
