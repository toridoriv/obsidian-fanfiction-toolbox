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
 * Checks if a given string represents a title or heading.
 *
 * This function uses a regular expression pattern to determine if the provided string
 * starts with 1 to 6 hash characters (#) followed by a space and then any characters.
 * If the string matches this pattern, it is considered a title or heading.
 *
 * @param {string} value - The string to check for a title or heading format.
 * @returns {boolean} Returns true if the string is a title or heading, false otherwise.
 */
export function isTitle(value) {
  return value.startsWith("#");
}

/**
 * Checks if a given string starts with indentation.
 *
 * This function determines whether the provided string begins with three spaces,
 * which is considered an indentation.
 *
 * @param {string} value - The string to check for indentation.
 * @returns {boolean} Returns true if the string starts with three spaces, false
 *                    otherwise.
 */
export function startsWithIdentation(value) {
  return value.startsWith("   ");
}

/**
 * Retrieves the cleaned paragraphs from the given string value.
 *
 * This function first removes any front matter from the input string, then splits it into
 * an array of lines. It filters out empty lines, lines that are titles or headings, and
 * lines that start with indentation. The remaining lines are considered paragraphs.
 *
 * Each paragraph is then processed by the {@link getCleanParagraph} function to format and
 * clean its content.
 *
 * @param {string} value - The input string to extract and clean paragraphs from.
 * @returns {CleanedParagraph[]} An array of cleaned paragraphs, where each paragraph is
 *                               an object containing the original and formatted content.
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
 * Cleans a paragraph by replacing double spaces with single spaces, replacing the
 * ellipsis character (…) with three periods (...), and trimming whitespace from the
 * beginning and end of the paragraph.
 *
 * @param {string} value - The paragraph to clean.
 * @returns {CleanedParagraph} An object containing the original paragraph and the
 *                             cleaned version of the paragraph.
 */
export function getCleanParagraph(value) {
  return {
    original: value,
    formatted: value.replaceAll("  ", " ").replaceAll("…", "...").trim(),
  };
}

/**
/**
 * Represents a paragraph that has been cleaned and formatted.
 *
 * @typedef CleanedParagraph
 * @property {string} original  The original paragraph text.
 * @property {string} formatted The formatted version of the paragraph.
 */
