import { curry } from "./utilities.js";

/**
 * Represents an abstract file in the Obsidian vault. It can be either a regular file or a
 * folder.
 *
 * @typedef {import("obsidian").TAbstractFile} TAbstractFile
 */

/**
 * Represents a folder in the Obsidian vault.
 *
 * @typedef {import("obsidian").TFolder} TFolder
 */

/**
 * Represents a file in the Obsidian vault.
 *
 * @typedef {import("obsidian").TFile} TFile
 */

/**
 * Coerces a value to a specified type.
 *
 * @template T - The type to coerce the value to.
 * @param {unknown} value - The value to coerce.
 * @returns {T} The coerced value.
 */
function coerce(value) {
  // eslint-disable-next-line prettier/prettier
  return /** @type {T} */ (value);
}

/**
 * Returns the input value unchanged.
 *
 * This function is useful in scenarios where you need to:
 * - Pass a value through a sequence of functions without modifying it.
 * - Satisfy a function or method that expects a callback, but you don't need to perform
 * any operations.
 * - Serve as a default or fallback function when no specific transformation is required.
 *
 * @template T - The type of the input value.
 * @param {T} value - The value to be returned.
 * @returns {T} The original input value.
 */
function identity(value) {
  return value;
}

/**
 * Creates a tuple from the provided values.
 *
 * A tuple is an array with a fixed number of elements, where each element can have a
 * different type.
 * This function takes any number of arguments and returns them as a tuple.
 *
 * @template {any[]} T - The types of the tuple elements.
 * @param {T} values - The values to include in the tuple.
 * @returns {T} A tuple containing the provided values.
 * @example
 *
 * const myTuple = tuple(1, 'hello', true);
 * console.log(myTuple); // Output: [1, 'hello', true]
 *
 */
function tuple(...values) {
  return values;
}

/**
 * Ensures the given value is defined (not `undefined`).
 *
 * @template T - The type of the value.
 * @param {T}      value     - The value to check.
 * @param {string} [message] - A custom error message.
 * @returns {Exclude<T, undefined>} The original value if defined.
 * @throws {TypeError} If the value is undefined.
 */
function defined(value, message = "Expected a defined value, but received `undefined`.") {
  if (value === undefined) {
    throw new TypeError(message);
  }

  return coerce(value);
}

/**
 * Ensures the given value is non-nullable (not `null` or `undefined`).
 *
 * @template T - The type of the value.
 * @param {T}      value     - The value to check.
 * @param {string} [message] - A custom error message.
 * @returns {Exclude<T, undefined | null>} The original value if defined.
 * @throws {TypeError} If the value is undefined or null.
 */
function nonNullable(
  value,
  message = "Expected a non-nullable value, but received TYPEOF.",
) {
  if (value === undefined || value === null) {
    throw new TypeError(message.replace("TYPEOF", typeof value));
  }

  return coerce(value);
}

/**
 * Checks if a value is defined (not `undefined`).
 *
 * @template T - The type of the value to check.
 * @param {T} value - The value to check for being defined.
 * @returns {value is Exclude<T, undefined>} Returns `true` if the value is not
 *                                           `undefined`, `false` otherwise.
 */
function isDefined(value) {
  return value !== undefined;
}

/**
 * Determines if a value is a plain object.
 *
 * A plain object is an object that is not an array and is not null.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is AnyObject} Returns `true` if the value is a plain object, `false`
 *                               otherwise.
 */
function isObject(value) {
  if (Array.isArray(value)) return false;
  if (value === null) return false;

  return typeof value === "object";
}

/**
 * Checks if two values are of the same type.
 *
 * The function compares the types of the two values using the `typeof` operator.
 * If both values are objects, it further checks if they are both plain objects or both
 * null.
 *
 * @template T - The type of the first value.
 * @param {T}       a - The first value to compare.
 * @param {unknown} b - The second value to compare.
 * @returns {b is T} Returns `true` if the values are of the same type, `false`
 *                   otherwise.
 */
function areEqualType(a, b) {
  const typeA = typeof a;
  const typeB = typeof b;

  if (typeA !== typeB) return false;

  if (typeA === "object") {
    if (a === null) return b === null;

    return isObject(a) === isObject(b);
  }

  return typeA === typeB;
}

/**
 * Checks if an object has a specific property that is defined and not null.
 *
 * @template {AnyObject} T - The type of the object.
 * @template {keyof T}   K - The type of the property key.
 * @param {T} value - The object to check for the property.
 * @param {K} key   - The property key to check.
 * @returns {value is SetRequired<T, K>} Returns `true` if the object has the specified
 *                                       property and it is defined and not null, `false`
 *                                       otherwise.
 */
function hasProperty(value, key) {
  return (
    Object.prototype.hasOwnProperty.call(value, key) &&
    isDefined(value[key]) &&
    value[key] !== null
  );
}

/**
 * Checks if a given entry is a file.
 *
 * @param {TAbstractFile} entry - The entry to check.
 * @returns {entry is TFile} Returns true if the entry is a file (has a string extension
 *                           property), false otherwise.
 */
function isFile(entry) {
  // @ts-ignore: ¯\_(ツ)_/¯
  return typeof entry.extension === "string";
}

/**
 * Checks if a given entry is a folder.
 *
 * @param {TAbstractFile} entry - The entry to check.
 * @returns {entry is TFolder} Returns true if the entry is a folder (does not have an
 *                             extension property),
 *                             false otherwise.
 */
function isFolder(entry) {
  // @ts-ignore: ¯\_(ツ)_/¯
  return typeof entry.extension === "undefined";
}

/**
 * Checks if an entry has a specific name.
 *
 * @param {string}        name  - The name to compare against the entry's name.
 * @param {TAbstractFile} entry - The entry to check.
 * @returns {boolean} Returns true if the entry's name matches the given name, false
 *                    otherwise.
 */
function isEntryWithName(name, entry) {
  return entry.name === name;
}

/**
 * Checks if a given entry is the "Metadata.md" file.
 */
const isMetadataFile = curry(isEntryWithName)("Metadata.md");

/**
 * Checks if a given entry is the "Worldbuilding.md" file.
 */
const isWorldbuildingFile = curry(isEntryWithName)("Worldbuilding.md");

/**
 * Checks if a string matches a given pattern.
 *
 * @param {string | RegExp} pattern - The pattern to match against. Can be a string or a
 *                                  regular expression.
 * @param {string}          value   - The string to check for a match.
 * @returns {boolean} Returns true if the string matches the pattern, false otherwise.
 * @example
 *
 * const pattern = /hello/i;
 * const value = "Hello, world!";
 * const isMatch = matchesPattern(pattern, value);
 * console.log(isMatch); // Output: true
 *
 */
function matchesPattern(pattern, value) {
  const regex = new RegExp(pattern);

  return regex.test(value);
}

export {
  areEqualType,
  coerce,
  defined,
  hasProperty,
  identity,
  isDefined,
  isEntryWithName,
  isFile,
  isFolder,
  isMetadataFile,
  isObject,
  isWorldbuildingFile,
  matchesPattern,
  nonNullable,
  tuple,
};
