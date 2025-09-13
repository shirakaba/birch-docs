/**
 * @satisfies {import("prettier").Config}
 * @see https://prettier.io/docs/en/configuration.html
 */
const config = {
  attributeGroups: ["^(id|name)$", "^data-", "^class$", "$DEFAULT"],
  bracketSpacing: true,
  plugins: [
    "@prettier/plugin-oxc",
    "prettier-plugin-organize-attributes",
    // `prettier-plugin-tailwindcss` must be loaded last:
    // https://github.com/tailwindlabs/prettier-plugin-tailwindcss?tab=readme-ov-file#compatibility-with-other-prettier-plugins
    "prettier-plugin-tailwindcss",
  ],
  tailwindFunctions: ["cva", "twMerge"],
  singleQuote: false,
  trailingComma: "all",
};

export default config;
