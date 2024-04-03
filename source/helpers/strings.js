import { negate } from "./fp.js";

const HEADING_PATTERN = /^#{1,6}\s.*$/;

/**
 * @param {string} text
 * @param {string} id
 */

function getTextBetweenDelimiters(text, id) {
  const delimiters = getDelimiters(id);
  const start = text.indexOf(delimiters.start);
  const end = text.indexOf(delimiters.end);

  if (start < 0 || end < 0) {
    return null;
  }

  return text.slice(start + delimiters.start.length, end);
}

/**
 * @param {string} value
 */
function removeMultipleSpaces(value) {
  return value.replaceAll(/\s{2,}/g, " ");
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

function getCleanParagraph(value) {
  let formatted = value
    .replaceAll("…", "...")
    .replaceAll("&nbsp;", " ")
    .replaceAll(/\.\.\.(?=\w)/g, "... ");

  if (startsWithIdentation(formatted)) {
    const firstNonWhiteChar = formatted.search(/\S/);
    const portion = formatted.substring(firstNonWhiteChar);
    formatted = formatted.replace(portion, removeMultipleSpaces(portion.trim()));
  } else {
    formatted = removeMultipleSpaces(formatted).trim();
  }

  return {
    original: value,
    formatted: formatted,
  };
}

/**
 * @param {string} id
 */
function getDelimiters(id) {
  return {
    start: `%% START_${id} %%\n`,
    end: `\n%% END_${id} %%`,
  };
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
function getCleanParagraphs(value) {
  const paragraphs = value.split("\n").filter(Boolean).filter(negate(isTitle));

  return paragraphs.map(getCleanParagraph);
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
function isTitle(value) {
  return HEADING_PATTERN.test(value);
}

/**
 * Checks if a given string starts with indentation.
 *
 * A string is considered indented if it begins with either two spaces or a hyphen
 * followed by a space.
 *
 * @param {string} value - The string to check for indentation.
 * @returns {boolean} Returns true if the string starts with three spaces, false
 *                    otherwise.
 */
function startsWithIdentation(value) {
  if (value.startsWith("\t")) {
    return true;
  }

  return value.startsWith("  ") || value.trim().startsWith("- ");
}

/**
 * Represents a paragraph that has been cleaned and formatted.
 *
 * @typedef
 * @property {string} original  The original paragraph text.
 * @property {string} formatted The formatted version of the paragraph.
 */
var CleanedParagraph;

export {
  CleanedParagraph,
  getCleanParagraph,
  getCleanParagraphs,
  getDelimiters,
  getTextBetweenDelimiters,
  isTitle,
  startsWithIdentation,
};
