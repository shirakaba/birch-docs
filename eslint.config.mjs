import { FlatCompat } from "@eslint/eslintrc";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import importPlugin from "eslint-plugin-import";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const next = compat.extends("next/core-web-vitals", "next/typescript");

// Next.js defines its own broken eslint-plugin-import rules that, possibly due
// to being a legacy eslint config, prevent us from overriding with the
// recommended rules.
//
// If we want to restore any of the Next.js rules, here's where they live:
// https://github.com/vercel/next.js/blob/370ba8d05e28723e424979f7a0ae7c6ebed520d9/packages/eslint-config-next/index.js#L107-L123
const importPluginRule = next.find((e) => e.plugins && "import" in e.plugins);
delete importPluginRule.plugins.import;

const eslintConfig = [
  ...next,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      ".source/**",
      "next-env.d.ts",
    ],
  },
  importPlugin.flatConfigs.recommended,
  eslintConfigPrettier,
  {
    rules: {
      "import/no-unresolved": "off",
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "import/order": [
        "warn",
        {
          alphabetize: { order: "asc", caseInsensitive: true },
          groups: [["builtin", "external"], ["parent"], ["sibling", "index"]],
          "newlines-between": "always",
        },
      ],
      "sort-imports": [
        "warn",
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],

      // Disable all rules from eslint-plugin-import that typescript-eslint is
      // already handling. Context:
      // - https://github.com/import-js/eslint-plugin-import/issues/1601#issuecomment-573347010
      // - https://github.com/typescript-eslint/typescript-eslint/issues/1333#issuecomment-574736003
      // - https://github.com/typescript-eslint/typescript-eslint/blob/v4.6.0/docs/getting-started/linting/FAQ.md#eslint-plugin-import
      "import/named": "off",
      "import/namespace": "off",
      "import/default": "off",
      "import/no-named-as-default-member": "off",

      // TODO: It's recommended to restrict the following expensive rules to run
      // only on precommit, rather than during regular editing:
      // https://github.com/typescript-eslint/typescript-eslint/blob/v4.6.0/docs/getting-started/linting/FAQ.md#eslint-plugin-import
      // - import/no-named-as-default
      // - import/no-cycle
      // - import/no-unused-modules
      // - import/no-deprecated

      "linebreak-style": ["error", "unix"],
    },
  },
];

export default eslintConfig;
