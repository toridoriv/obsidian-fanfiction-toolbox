import { areEqualType, hasProperty, isObject } from "./validation.js";

/**
 * Groups an array of items based on a provided callback function.
 *
 * @template T - The type of elements in the input array.
 * @param {T[]}                  items    - The array of items to be grouped.
 * @param {(value: T) => string} callback - A function that takes an item and returns a
 *                                        string key for grouping.
 * @returns {Record<string, T[]>} An object where the keys are the group names and the
 *                                values are arrays of items belonging to each group.
 */
function groupBy(items, callback) {
  /**
   * @type {Record<string, T[]>}
   */
  const result = {};

  for (const item of items) {
    const key = callback(item);
    if (!result[key]) {
      result[key] = [];
    }

    result[key].push(item);
  }

  return result;
}

/**
 * Creates a deep clone of an object with specified overrides for certain properties.
 *
 * @template {AnyObject}      T
 * @template {DeepPartial<T>} U
 * @param {T} base      - The base object to clone and apply overrides to.
 * @param {U} overrides - The object containing properties to override in the base object.
 * @returns {T} A new object that is a clone of the base with overrides applied.
 * @throws {Error} - Throws an error if either the base or the overrides is not an
 *                 object.
 */
function cloneWithOverrides(base, overrides) {
  if (!isObject(base) || !isObject(overrides)) {
    throw new Error("Both inputs must be objects");
  }

  /**
   * @type {T}
   */
  const result = structuredClone(base);

  for (const key in base) {
    if (!hasProperty(overrides, key)) {
      continue;
    }

    const value = base[key];
    const override = overrides[key];

    if (!areEqualType(value, override)) {
      continue;
    }

    result[key] = isObject(value) ? cloneWithOverrides(value, override) : override;
  }

  return result;
}

/**
 * Creates a deep clone of an object with specified overrides and merges additional
 * properties.
 *
 * @template {AnyObject}      T
 * @template {DeepPartial<T>} U
 * @param {T} base      - The base object to clone and apply overrides to.
 * @param {U} overrides - The object containing properties to override in the base object.
 * @returns {T} A new object that is a clone of the base with overrides applied.
 * @throws {Error} - Throws an error if either the base or the overrides is not an
 *                 object.
 */
function mergeWithOverrides(base, overrides) {
  if (!isObject(base) || !isObject(overrides)) {
    throw new Error("Both inputs must be objects");
  }

  /**
   * @type {T}
   */
  const result = structuredClone(base);

  for (const key in base) {
    if (!hasProperty(overrides, key)) {
      continue;
    }

    const value = base[key];
    const override = overrides[key];

    if (!areEqualType(value, override)) {
      continue;
    }

    result[key] = isObject(value) ? mergeWithOverrides(value, override) : override;
  }

  const clonedOverrides = structuredClone(overrides);

  return Object.assign(clonedOverrides, result);
}

/**
 * Picks a specific property from an object and returns its value.
 *
 * @template {AnyObject} O
 * @template {keyof O}   K
 * @param {O} obj - The input object from which to pick a property.
 * @param {K} key - The key of the property to be picked.
 * @returns {O[K]} The value of the specified property.
 */
function pick(obj, key) {
  if (!(key in obj)) {
    throw new Error(`The key ${String(key)} doesn't exist on the given object.`);
  }

  return obj[key];
}

/**
 * Retrieves the first element of an array.
 *
 * @template {any[]} T - The type of the input array.
 * @param {T} list - The input array.
 * @returns {T[number]} The first element of the array.
 */
function first(list) {
  return list[0];
}

export { cloneWithOverrides, first, groupBy, mergeWithOverrides, pick };
