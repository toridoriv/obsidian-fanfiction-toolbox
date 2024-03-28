import markdown from "@wcj/markdown-to-html";
import { App, Modal, Notice, Plugin } from "obsidian";

import { getContentWithoutFrontMatter } from "./helpers/document.js";
import tasks from "./tasks.js";

const DEFAULT_SETTINGS = {};

class CreateFandomFolder extends Modal {
  /**
   * @param {App} app
   */
  constructor(app) {
    super(app);
  }

  onOpen() {
    let { contentEl } = this;
    contentEl.setText("Look at me, I'm a modal! 👀");
  }

  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }
}

export default class FanfictionToolbox extends Plugin {
  settings = DEFAULT_SETTINGS;

  async onload() {
    await this.loadSettings();

    this.addCommand({
      id: "remove-double-spaces",
      name: "Remove Double Spaces",
      editorCallback: (editor) => {
        const text = editor.getDoc().getValue();
        const newText = text.replace(/\b\s{2}\b/g, " ");
        editor.getDoc().setValue(newText);
      },
    });

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
