import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  // https://fumadocs.dev/docs/ui/static-export
  output: "export",
  reactStrictMode: true,
  // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  trailingSlash: true,
  // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  skipTrailingSlashRedirect: true,

  // Force Next.js to use relative paths for static assets
  assetPrefix: "https://birchlabs.co.uk/jamie/docs",
};

export default withMDX(config);
