import { obsidian } from "./obsidian.js";
import tasks from "./tasks.js";

const DEFAULT_SETTINGS = {};

class FanfictionToolbox extends obsidian.Plugin {
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

export { FanfictionToolbox };
