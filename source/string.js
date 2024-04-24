import { first } from "./objects.js";

/**
 * Replaces the ellipsis character (…) with three dots (...) and adds a space after the
 * three dots if they are not followed by a whitespace character or a quotation mark.
 *
 * @param {string} value - The input string to be processed.
 * @returns {string} The modified string with ellipsis characters replaced and spaces
 *                   added.
 */
function patchEllipsis(value) {
  return value.replaceAll("…", "...").replaceAll(/\.{3}(?=[^\s"])/g, "... ");
}

/**
 * Replaces all occurrences of the HTML non-breaking space entity (&nbsp;) with a regular
 * space character.
 *
 * @param {string} value - The input string that may contain HTML non-breaking space
 *                       entities.
 * @returns {string} The modified string with all &nbsp; entities replaced by spaces.
 */
function replaceEntityNonBreakingSpaces(value) {
  return value.replaceAll("&nbsp;", " ");
}

/**
 * Removes leading and trailing whitespace from the input string, splits it into an array
 * of words,
 * filters out any empty strings, and then joins the remaining words back into a string
 * with a single space between each word.
 *
 * @param {string} value - The input string that may contain additional spaces.
 * @returns {string} The modified string with leading/trailing whitespace removed and
 *                   multiple spaces between words reduced to a single space.
 */
function removeAdditionalSpaces(value) {
  const trimmed = value.trim();
  const words = trimmed.split(" ").filter(Boolean);

  return words.join(" ");
}

/**
 * Replaces sequences of three or more consecutive newline characters (\n) with exactly
 * two newline characters.
 *
 * @param {string} value - The input string that may contain multiple consecutive line
 *                       breaks.
 * @returns {string} The modified string with sequences of three or more newlines
 *                   replaced by two newlines.
 */
function removeMultipleLineBreaks(value) {
  return value.replaceAll(/\n{3,}/g, "\n\n");
}

/**
 * Represents the options for surrounding a string with start and end strings, separated
 * by a separator string.
 *
 * @typedef
 * @property {string} start The string to be added at the beginning.
 * @property {string} end   The string to be added at the end.
 * @property {string} sep   The separator string to be added between the start/end strings
 *                          and the main content.
 */
var SurroundOptions;

/**
 * Surrounds the input string with the specified start and end strings, separated by the
 * given separator string.
 *
 * @param {string}          value   - The input string to be surrounded.
 * @param {SurroundOptions} options - An object containing the start, end, and separator
 *                                  strings.
 * @returns {string} The input string surrounded by the start and end strings, with the
 *                   separator string in between.
 */
function surround(value, options) {
  return `${options.start}${options.sep}${value}${options.sep}${options.end}`;
}

/**
 * Removes the specified start and end strings, along with the separator string, from the
 * beginning and end of the input string.
 *
 * @param {string}          value   - The input string to be unsurrounded.
 * @param {SurroundOptions} options - An object containing the start, end, and separator
 *                                  strings to be removed.
 * @returns {string} The input string with the start, end, and separator strings removed
 *                   from the beginning and end.
 */
function unsurround(value, options) {
  return value
    .replace(`${options.start}${options.sep}`, "")
    .replace(`${options.sep}${options.end}`, "");
}

/**
 * Finds all matches of a given pattern in the input string and returns an array of the
 * matched substrings.
 *
 * @param {string | RegExp} pattern - The pattern to match against, either as a string or
 *                                  a regular expression.
 * @param {string}          value   - The input string to search for matches.
 * @returns {string[]} An array of all the substrings that match the given pattern.
 */
function matchAll(pattern, value) {
  const regex =
    typeof pattern === "string"
      ? new RegExp(pattern, "g")
      : new RegExp(pattern.source, pattern.flags || "g");
  const matches = [...value.matchAll(regex)].map(first);

  return matches;
}

/**
 * Replaces all occurrences of a given pattern in the input string with the specified
 * replacement string.
 *
 * @param {string | RegExp} pattern     - The pattern to match against, either as a string
 *                                      or a regular expression.
 * @param {string}          value       - The input string in which to replace the
 *                                      matches.
 * @param {string}          replacement - The string to replace each match with.
 * @returns {string} The input string with all occurrences of the pattern replaced by the
 *                   replacement string.
 */
function replaceAll(pattern, value, replacement) {
  const regex =
    typeof pattern === "string"
      ? new RegExp(pattern, "g")
      : new RegExp(pattern.source, pattern.flags || "g");

  return value.replaceAll(regex, replacement);
}

export {
  matchAll,
  patchEllipsis,
  removeAdditionalSpaces,
  removeMultipleLineBreaks,
  replaceAll,
  replaceEntityNonBreakingSpaces,
  surround,
  SurroundOptions,
  unsurround,
};
