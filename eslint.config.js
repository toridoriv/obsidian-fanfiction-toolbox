import { eslintConfig } from "@toridoriv/eslint-config";

eslintConfig.ignorePatterns[0].ignores?.push("dist/", "obsidian.md/");

/**
 * @type {import("eslint").Linter.FlatConfig[]}
 */
export default [
  ...eslintConfig.ignorePatterns,
  ...eslintConfig.javascript.browser,
  ...eslintConfig.javascript.node,
  ...eslintConfig.typescript,
  ...eslintConfig.jsdoc,
  ...eslintConfig.json,
  ...eslintConfig.markdown,
  {
    rules: {
      "no-unused-vars": ["warn", { varsIgnorePattern: "^App$" }],
    },
  },
  ...eslintConfig.prettier,
];
