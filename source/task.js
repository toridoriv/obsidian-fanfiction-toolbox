/**
 * Represents a task with a name, icon, and optional editor and ribbon callbacks.
 */
export class Task {
  /**
   * Creates a new Task instance.
   *
   * @param {string} name - The human readable name of the task.
   * @param {string} icon - The icon associated with the task.
   */
  constructor(name, icon) {
    /**
     * The human-readable name of the task.
     *
     * @type {string}
     */
    this.name = name;

    /**
     * Generates a unique identifier for the task by converting the task name to lowercase
     * and replacing all spaces with hyphens.
     *
     * For example, if the task name is "My Task", the generated ID will be "my-task".
     */
    this.id = name.toLowerCase().replaceAll(" ", "-");

    /**
     * The human-readable name of the task.
     *
     * @type {string}
     */
    this.icon = icon;

    /**
     * The callback function to be executed when the task is triggered from the editor.
     *
     * @type {Obsidian.CommandEditorCallback | null}
     */
    this.editorCallback = null;

    /**
     * The callback function to be executed when the task is triggered from the ribbon.
     *
     * @type {Obsidian.RibbonCallback | null}
     */
    this.ribbonCallback = null;
  }

  /**
   * Defines the callback function to be executed when the task is triggered from the
   * editor.
   *
   * @param {Obsidian.CommandEditorCallback} fn - The callback function.
   * @returns {this} The current Task instance.
   */
  defineEditorCallback(fn) {
    this.editorCallback = fn;

    return this;
  }

  /**
   * Defines the callback function to be executed when the task is triggered from the
   * ribbon.
   *
   * @param {Obsidian.RibbonCallback} fn - The callback function.
   * @returns {this} The current Task instance.
   */
  defineRibbonCallback(fn) {
    this.ribbonCallback = fn;

    return this;
  }

  /**
   * Registers the task with the provided plugin.
   *
   * @param {FanfictionToolboxPlugin} plugin - The plugin to register the task with.
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
