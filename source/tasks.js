import * as docHelpers from "./helpers/document.js";
import { Task } from "./task.js";

const ToHtmlTask = new Task("To HTML", "square-code");

ToHtmlTask.defineEditorCallback(docHelpers.copyAsHtmlToClipboard);
ToHtmlTask.defineRibbonCallback(function () {
  const file = this.app.workspace.activeEditor;

  if (file && file.editor) {
    docHelpers.copyAsHtmlToClipboard(file.editor);
  }
});

const CleanParagraphs = new Task("Clean Paragraphs", "wrap-text");

CleanParagraphs.defineEditorCallback(docHelpers.cleanParagraphs);

CleanParagraphs.defineRibbonCallback(function () {
  const file = this.app.workspace.activeEditor;

  if (file && file.editor) {
    docHelpers.cleanParagraphs(file.editor);
  }
});

  }
});

/**
 * @type {Task[]}
 */
export default [ToHtmlTask, CleanParagraphs];
