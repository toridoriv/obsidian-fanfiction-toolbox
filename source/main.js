import { App, Plugin } from "obsidian";

import tasks from "./tasks.js";

const DEFAULT_SETTINGS = {};
export default class FanfictionToolbox extends Plugin {
  settings = DEFAULT_SETTINGS;

  async onload() {
    await this.loadSettings();

    for (const task of tasks) {
      task.register(this);
    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
