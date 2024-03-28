import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const packageJson = require("../package.json");

/**
 * @type {PluginManifest}
 */
export const manifest = {
  id: packageJson.name.split("/")[1].replace("obsidian-", ""),
  name: packageJson.config.plugin.manifest.name,
  version: packageJson.version,
  minAppVersion: "0.15.0",
  description: packageJson.description,
  author: packageJson.author.name,
  authorUrl: packageJson.author.url,
  isDesktopOnly: false,
};

/**
 * @typedef {import("obsidian").PluginManifest} PluginManifest
 */
