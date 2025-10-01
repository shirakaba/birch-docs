import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  // https://fumadocs.dev/docs/ui/static-export
  output: "export",
  reactStrictMode: true,
};

export default withMDX(config);
