import { obsidian } from "./obsidian.js";

/**
 * EditorModal is a class that extends the obsidian.Modal class.
 * It represents a modal dialog in the Obsidian application.
 *
 * @template T - The type of the initial value and value stored in the modal.
 */
class EditorModal extends obsidian.Modal {
  /**
   * Creates a new instance of EditorModal.
   *
   * @param {FanfictionToolboxPlugin} plugin       - The plugin instance.
   * @param {obsidian.Editor}         editor       - The Obsidian editor instance.
   * @param {T}                       initialValue - The initial value to be stored in the
   *                                               modal.
   */
  constructor(plugin, editor, initialValue) {
    super(plugin.app);

    this.plugin = plugin;
    this.editor = editor;
    this.initialValue = structuredClone(initialValue);
    this.value = structuredClone(initialValue);

    this.init();
  }

  /**
   * Sets the value stored in the modal.
   *
   * @param {T} value - The value to be set.
   * @returns {this} The current EditorModal instance.
   */
  setValue(value) {
    if (value && typeof value === "object") {
      this.value = structuredClone(value);
    } else {
      this.value = value;
    }

    console.log({ setValue: value });

    return this;
  }

  /**
   * Performs initialization tasks.
   *
   * @returns {this} The current EditorModal instance.
   */
  init() {
    return this;
  }

  /**
   * Handles the closing of the modal.
   * Resets the value to the initial value and clears the modal content.
   */
  onClose() {
    this.value = structuredClone(this.initialValue);

    const { contentEl } = this;
    contentEl.empty();
  }

  /**
   * Sets the title and description of the modal.
   *
   * @param {string} title            - The display title of the modal.
   * @param {string} [description=""] - The description of the modal (optional).
   */
  setTitles(title, description = "") {
    const { contentEl } = this;

    contentEl.createEl("h1", { text: title });

    if (description) {
      contentEl.createEl("h2", { text: description });
    }
  }
}

export { EditorModal };
