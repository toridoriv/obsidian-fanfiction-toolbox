import { cleanParagraphs, copyAsHtmlToClipboard } from "./helpers/document.js";
import { Task } from "./task.js";

const ToHtmlTask = new Task("To HTML", "square-code");

ToHtmlTask.defineEditorCallback(copyAsHtmlToClipboard);
ToHtmlTask.defineRibbonCallback(function () {
  const file = this.app.workspace.activeEditor;

  if (file && file.editor) {
    copyAsHtmlToClipboard(file.editor);
  }
});

const CleanParagraphs = new Task("Clean Paragraphs", "wrap-text");

CleanParagraphs.defineEditorCallback(cleanParagraphs);

CleanParagraphs.defineRibbonCallback(function () {
  const file = this.app.workspace.activeEditor;

  if (file && file.editor) {
    cleanParagraphs(file.editor);
  }
});

/**
 * @type {Task[]}
 */
export default [ToHtmlTask, CleanParagraphs];
