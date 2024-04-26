#!/usr/bin/env node
import fs from "node:fs";

import { manifest } from "../source/manifest.js";

const vault =
  process.env.NODE_ENV === "development"
    ? "./example"
    : process.env.FANFICTION_TOOLBOX_TEMPLATE_VAULT;
const target = `${vault}/.obsidian/plugins/${manifest.id}`;
const originDir = `${process.env.DEVELOPMENT_DIR_PERSONAL}/Obsidian-Fanfiction-Toolbox`;

if (!fs.existsSync(target)) {
  fs.mkdirSync(target, { recursive: true });
}

fs.copyFileSync(`${originDir}/dist/main.js`, `${target}/main.js`);
fs.copyFileSync(`${originDir}/dist/manifest.json`, `${target}/manifest.json`);
fs.copyFileSync(`${originDir}/static/styles.css`, `${target}/styles.css`);
