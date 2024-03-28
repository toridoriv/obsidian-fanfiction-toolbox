export class Task {
  /**
   * @param {string} name
   * @param {string} icon
   */
  constructor(name, icon) {
    this.name = name;
    this.id = name.toLowerCase().replaceAll(" ", "-");
    this.icon = icon;

    /**
     * @type {Obsidian.CommandEditorCallback | null}
     */
    this.editorCallback = null;
    /**
     * @type {Obsidian.RibbonCallback | null}
     */
    this.ribbonCallback = null;
  }

  /**
   * @param {Obsidian.CommandEditorCallback} fn
   * @returns {this}
   */
  defineEditorCallback(fn) {
    this.editorCallback = fn;

    return this;
  }

  /**
   * @param {Obsidian.RibbonCallback} fn
   * @returns {this}
   */
  defineRibbonCallback(fn) {
    this.ribbonCallback = fn;

    return this;
  }

  /**
   * @param {FanfictionToolboxPlugin} plugin
   */
  register(plugin) {
    if (this.editorCallback) {
      plugin.addCommand({
        id: this.id,
        name: this.name,
        icon: this.icon,
        editorCallback: this.editorCallback.bind(plugin),
      });
    }

    if (this.ribbonCallback) {
      plugin.addRibbonIcon(this.icon, this.name, this.ribbonCallback.bind(plugin));
    }
  }
}
