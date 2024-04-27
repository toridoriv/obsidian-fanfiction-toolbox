#!/usr/bin/env node
import fs from "node:fs";

import * as prettier from "prettier";

import { findBetweenDelimiters } from "../../source/string.js";

const modelsFilePath = "./source/large-language-models.js";
const storedModels = fs.readFileSync("./static/models.json", "utf-8").trim();
const modelsFile = fs.readFileSync(modelsFilePath, "utf-8");
const section = findBetweenDelimiters(modelsFile, {
  sep: "\n",
  start: "// START",
  end: "// END",
});

if (section) {
  const rawContent = modelsFile.replace(section, `\nconst models = ${storedModels};\n`);
  const options = await prettier.resolveConfig(modelsFilePath);
  const newFileContent = await prettier.format(rawContent, options || {});

  fs.writeFileSync(modelsFilePath, newFileContent, "utf-8");
}
