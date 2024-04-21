import { defined } from "./validation.js";

/**
 * Represents a predicate function.
 *
 * @template {any[]} [P=any[]] - The parameter types of the predicate function. Defaults
 *                             to any[].
 * @typedef {(...args: P) => boolean}
 */
var Predicate;

/**
 * Represents a function that takes any number of arguments and returns any value.
 *
 * @type {(...args: any[]) => any}
 */
var AnyFunction;

/**
 * A type representing a curried function that takes a single argument of type `A` and
 * returns a value of type `R`.
 *
 * @template A
 * @template R
 * @typedef {{ <T1 extends A>(a: T1): R }}
 */
var Curried1;

/**
 * A type representing a curried function that can take one or two arguments.
 * - If one argument of type `A` is provided, it returns a function that expects a single
 * argument of type `B`.
 * - If both arguments of types `A` and `B` are provided, it returns a value of type `R`.
 *
 * @template A
 * @template B
 * @template R
 * @typedef {{
 *   <T1 extends A>(a: T1): Curried1<B, R>;
 *   <T1 extends A, T2 extends B>(a: T1, b: T2): R;
 * }}
 */
var Curried2;

/**
 * A type representing a curried function with up to three arguments.
 * - If one argument of type `A` is provided, it returns a function that expects two
 * arguments of types `B` and `C`.
 * - If two arguments of types `A` and `B` are provided, it returns a function that
 * expects a single argument of type `C`.
 * - If all three arguments of types `A`, `B`, and `C` are provided, it returns a value of
 * type `R`.
 *
 * @template A
 * @template B
 * @template C
 * @template R
 * @typedef {{
 *   <T1 extends A>(a: T1): Curried2<B, C, R>;
 *   <T1 extends A, T2 extends B>(a: T1, b: T2): Curried1<C, R>;
 *   <T1 extends A, T2 extends B, T3 extends C>(a: T1, b: T2, c: T3): R;
 * }}
 */
var Curried3;

/**
 * A type representing a curried function with up to four arguments.
 * - If one argument of type `A` is provided, it returns a function that expects three
 * arguments of types `B`, `C`, and `D`.
 * - If two arguments of types `A` and `B` are provided, it returns a function that
 * expects two arguments of types `C` and `D`.
 * - If three arguments of types `A`, `B`, and `C` are provided, it returns a function
 * that expects a single argument of type `D`.
 * - If all four arguments of types `A`, `B`, `C`, and `D` are provided, it returns a
 * value of type `R`.
 *
 * @template A
 * @template B
 * @template C
 * @template D
 * @template R
 * @typedef {{
 *   <T1 extends A>(a: T1): Curried3<B, C, D, R>;
 *   <T1 extends A, T2 extends B>(a: T1, b: T2): Curried2<C, D, R>;
 *   <T1 extends A, T2 extends B, T3 extends C>(a: T1, b: T2, c: T3): Curried1<D, R>;
 *   <T1 extends A, T2 extends B, T3 extends C, T4 extends D>(
 *     a: T1,
 *     b: T2,
 *     c: T3,
 *     d: T4,
 *   ): R;
 * }}
 */
var Curried4;

/**
 * A utility type that represents a curried version of the original function type `F`.
 * It infers the argument types and the return type of the function `F`, and based on the
 * number of arguments, it provides the corresponding curried function type.
 *
 * @template F
 * @typedef {F extends (...args: infer Args) => infer R
 *   ? Args extends [infer A, infer B, infer C, infer D]
 *     ? Curried4<A, B, C, D, R>
 *     : Args extends [infer A, infer B, infer C]
 *       ? Curried3<A, B, C, R>
 *       : Args extends [infer A, infer B]
 *         ? Curried2<A, B, R>
 *         : Args extends [infer A]
 *           ? Curried1<A, R>
 *           : R
 *   : never}
 */
var Curried;

/**
 * Represents any curried function with varying arity.
 *
 * @typedef {| Curried1<any, any>
 *   | Curried2<any, any, any>
 *   | Curried3<any, any, any, any>
 *   | Curried4<any, any, any, any, any>}
 */
var AnyCurriedFunction;

/**
 * Reverses the order of elements in a tuple type.
 *
 * @template {any[]} T - The tuple type to be reversed.
 * @typedef {T extends [any, ...infer R]
 *   ? T extends [...infer F, ...R]
 *     ? [...Reverse<R>, ...F]
 *     : T
 *   : T}
 */
var Reverse;

/**
 * Represents a function with its parameters reversed.
 *
 * @template {AnyFunction} F
 * @typedef {Expand<(...args: Reverse<Parameters<F>>) => ReturnType<F>>}
 */
var ReversedFunction;

/**
 * Curries a function by returning a new function that can take arguments until the
 * original function's arity is satisfied.
 *
 * @template {AnyFunction | AnyCurriedFunction} F
 * @param {F} fn - The function to curry.
 * @returns {F extends AnyCurriedFunction ? F : Curried<F>}
 */
function curry(fn) {
  const arity = fn.length;
  const curriedName = `curried${fn.name[0].toUpperCase()}${fn.name.substring(1)}`;
  const implementation = {
    arity,
    [fn.name]: fn,
    /**
     * @param {any[]} args
     * @returns {any}
     */
    [curriedName](...args) {
      return this.arity > args.length
        ? // @ts-ignore: ¯\_(ツ)_/¯
          this[curriedName].bind(this, ...args)
        : // @ts-ignore: ¯\_(ツ)_/¯
          this[fn.name](...args);
    },
  };

  // @ts-ignore: ¯\_(ツ)_/¯
  return implementation[curriedName].bind(implementation);
}

/**
 * Negates the result of a given predicate function.
 *
 * @template {Predicate} T - The type of the predicate function.
 * @param {T} predicate - The predicate function to negate.
 * @returns {Predicate<Parameters<T>>} - A new function that returns the negated result
 *                                     of the original predicate.
 * @throws {TypeError} - If the provided argument is not a function.
 */
function negate(predicate) {
  if (typeof predicate !== "function") {
    throw new TypeError("Expected a function");
  }

  return function $negate(...args) {
    return !predicate(...args);
  };
}

/**
 * Reverses the order of arguments for a given function.
 *
 * @template {AnyFunction} F
 * @param {F} fn - The original function whose arguments are to be reversed.
 * @returns {ReversedFunction<F>} A new function that takes the same arguments as the
 *                                original function but in reverse order.
 */
function reverseArgs(fn) {
  const reversedName = `reversed${fn.name[0].toUpperCase()}${fn.name.substring(1)}`;

  const implementation = {
    /**
     * @param {any[]} args
     */
    [reversedName](...args) {
      const sliced = fn.length < args.length ? args.slice(0, fn.length) : args;

      return fn(...sliced.toReversed());
    },
  };

  Object.defineProperty(
    implementation[reversedName],
    "length",
    defined(Object.getOwnPropertyDescriptor(fn, "length")),
  );

  return implementation[reversedName];
}

export {
  AnyCurriedFunction,
  AnyFunction,
  Curried,
  Curried1,
  Curried2,
  Curried3,
  Curried4,
  curry,
  negate,
  Predicate,
  Reverse,
  reverseArgs,
  ReversedFunction,
};
