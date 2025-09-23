import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/docs",
        permanent: false,
      },
    ];
  },
  reactStrictMode: true,
};

export default withMDX(config);
