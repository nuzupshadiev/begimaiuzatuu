import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // The template repository is self-contained. Pinning both roots stops Next
  // from walking up into a parent workspace when this folder happens to sit
  // beside sibling templates that carry their own lockfile.
  turbopack: { root: projectRoot },
  outputFileTracingRoot: projectRoot,
  images: {
    // Every image is a local file under /public; no remote patterns needed.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
