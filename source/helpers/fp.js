/**
 * Negates the result of a given predicate function.
 *
 * @template {Predicate} T - The type of the predicate function.
 * @param {T} predicate - The predicate function to negate.
 * @returns {Predicate<Parameters<T>>} - A new function that returns the negated result
 *                                     of the original predicate.
 * @throws {TypeError} - If the provided argument is not a function.
 */
export function negate(predicate) {
  if (typeof predicate !== "function") {
    throw new TypeError("Expected a function");
  }

  return function $negate(...args) {
    return !predicate(...args);
  };
}

/**
 * Represents a predicate function.
 *
 * @template {any[]} [P=any[]] - The parameter types of the predicate function. Defaults
 *                             to any[].
 * @typedef {(...args: P) => boolean} Predicate
 */
