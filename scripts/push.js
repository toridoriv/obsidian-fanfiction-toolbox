#!/usr/bin/env node
import fs from "node:fs";

import { manifest } from "../source/manifest.js";

const vault = process.env.FANFICTION_DIR;
const target = `${vault}/.obsidian/plugins/${manifest.id}`;

if (!fs.existsSync(target)) {
  fs.mkdirSync(target);
}

fs.copyFileSync("./dist/main.js", `${target}/main.js`);
fs.copyFileSync("./dist/manifest.json", `${target}/manifest.json`);
