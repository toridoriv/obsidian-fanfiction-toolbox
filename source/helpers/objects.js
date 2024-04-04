import { areEqualType, hasProperty, isObject } from "./validation.js";

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

export { cloneWithOverrides, pick };
