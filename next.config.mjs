import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  webpack(config) {
    // SVG support as per https://react-svgr.com/docs/next/

    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg"),
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        // *.svg?url
        resourceQuery: /url/,
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: {
          // Exclude if *.svg?url
          not: [...fileLoaderRule.resourceQuery.not, /url/],
        },
        use: ["@svgr/webpack"],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  experimental: {
    /**
     * TODO: migrate `turbo` key to `turbopack`. It's supposed to be dropped in
     *       Next.js 16, but for some reason I am finding the opposite. Worth
     *       trying the suggested codemod:
     *       npx @next/codemod@latest next-experimental-turbo-to-turbopack .
     * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack
     */
    turbo: {
      rules: {
        // Stop SVGs getting loaded as client components when importing them for
        // use in OG images.
        // https://github.com/gregberge/svgr/issues/883#issuecomment-2216110376
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
};

export default withMDX(config);
