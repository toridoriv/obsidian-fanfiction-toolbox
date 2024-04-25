/**
 * Takes an array of functions and an initial value, applies the first function to the
 * value and then it applies the next function to the return value of that first
 * operation.
 *
 * @type {import("./composite.types.ts").Composite.Pipe}
 * @example
 *
 * ```javascript
 * import { pipe } from "./composite.js";
 *
 * pipe(sum, increment, tap)(5, 5) // 11
 * pipe(salute, tap)("Peter") // Hello, Peter
 * pipe(increment, sum)(1) // error: Argument of type 'number' is not assignable to parameter of type 'never'
 * ```
 *
 */
function pipe(...fns) {
  // @ts-ignore: ¯\_(ツ)_/¯
  return function $pipe(...initialValue) {
    return fns.reduce((previousValue, fn) => {
      // @ts-ignore
      return Array.isArray(previousValue) ? fn(...previousValue) : fn(previousValue);
    }, initialValue);
  };
}

export { pipe };
