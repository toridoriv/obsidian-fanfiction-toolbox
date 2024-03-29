import markdown from "@wcj/markdown-to-html";
import { Notice } from "obsidian";

const FM_DELIMITER = "---";
const FM_DELIMITER_LENGTH = FM_DELIMITER.length;

/**
 * Get the content of a file without the front matter portion.
 *
 * @param {string} value
 */
export function getContentWithoutFrontMatter(value) {
  const { end } = getFrontMatterIndexes(value);

  return value.substring(end).trim();
}

/**
 * Checks if a given string starts with a front matter marker.
 *
 * Front matter is a block of YAML or JSON at the beginning of a file that contains
 * metadata about the file's contents.
 *
 * The front matter block is typically fenced by triple-dashed lines (`---`).
 *
 * @param {string} value - The string to check for a front matter marker.
 * @returns {boolean}
 */
export function hasFrontMatter(value) {
  return value.startsWith(FM_DELIMITER);
}

/**
 * Finds the start and end indexes of the front matter in a given string.
 *
 * @param {string} value - The string to search for front matter.
 * @returns {{ start: number; end: number }} An object with `start` and `end` properties
 *                                           indicating the indexes of the front matter
 *                                           delimiters.
 */
export function getFrontMatterIndexes(value) {
  const frontmatter = hasFrontMatter(value);
  const start = frontmatter ? value.indexOf(FM_DELIMITER) : 0;
  const end = frontmatter
    ? value.indexOf(FM_DELIMITER, FM_DELIMITER_LENGTH) + FM_DELIMITER_LENGTH
    : 0;

  return {
    start,
    end,
  };
}

/**
 * Copies the content of the current document in the Obsidian editor to the clipboard as
 * HTML.
 * It first retrieves the document content, removes any front matter, and converts the
 * remaining Markdown content to HTML using the `markdown` function.
 * If the conversion is successful and the result is a string, it writes the HTML to the
 * clipboard and displays a success notice.
 *
 * @param {Obsidian.Editor} editor - The Obsidian editor instance.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
export async function copyAsHtmlToClipboard(editor) {
  const doc = editor.getDoc();
  const text = doc.getValue();
  const newText = markdown(getContentWithoutFrontMatter(text));

  if (typeof newText === "string") {
    await navigator.clipboard.writeText(newText);

    new Notice("✨ Copied to clipboard!");
  }
}

/**
 * Cleans the paragraphs in the current document open in the Obsidian editor.
 *
 * This function retrieves the document content, gets the cleaned paragraphs using the
 * `getCleanParagraphs` function, and then replaces each original paragraph with its
 * formatted version in the document.
 *
 * The cleaned document content is then set back to the editor, and a success notice is
 * displayed.
 *
 * @param {Obsidian.Editor} editor - The Obsidian editor instance.
 * @returns {void}
 */
export function cleanParagraphs(editor) {
  const doc = editor.getDoc();
  const text = doc.getValue();
  const clean = getCleanParagraphs(text);
  let result = text;

  for (const paragraph of clean) {
    result = result.replace(paragraph.original, paragraph.formatted);
  }

  doc.setValue(result);

  new Notice("✨ Paragraphs cleaned!");
}

/**
 * @param {string} value
 * @returns {boolean}
 */
export function isTitle(value) {
  return value.startsWith("#");
}

/**
 * @param {string} value
 * @returns {boolean}
 */
export function startsWithIdentation(value) {
  return value.startsWith("   ");
}

/**
 * @param {string} value
 * @returns {CleanedParagraph[]}
 */
export function getCleanParagraphs(value) {
  const paragraphs = getContentWithoutFrontMatter(value)
    .split("\n")
    .filter(Boolean)
    .filter((v) => !isTitle(v))
    .filter((v) => !startsWithIdentation(v));

  return paragraphs.map(getCleanParagraph);
}

/**
 * @param {string} value
 * @returns {CleanedParagraph}
 */
export function getCleanParagraph(value) {
  return {
    original: value,
    formatted: value.replaceAll("  ", " ").replaceAll("…", "...").trim(),
  };
}

/**
 * @typedef CleanedParagraph
 * @property {string} original
 * @property {string} formatted
 */
