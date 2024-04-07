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

export { areEqualType, coerce, defined, hasProperty, isDefined, isObject };
