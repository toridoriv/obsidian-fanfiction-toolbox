import { prettierConfig } from "@toridoriv/eslint-config";

// @ts-ignore
prettierConfig.overrides.push({
  files: ["*.hbs"],
  options: {
    parser: "glimmer",
    printWidth: 550,
    tabWidth: 2,
    bracketSameLine: true,
    proseWrap: "never",
    htmlWhitespaceSensitivity: "strict",
    singleAttributePerLine: false,
    jsxBracketSameLine: true,
  },
});

export default prettierConfig;
