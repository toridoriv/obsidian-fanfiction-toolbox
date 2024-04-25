/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
export namespace Composite {
  /**
   * Represents an array with a generic type. If type is not defined, fallbacks to
   * unknown.
   */
  export type Collection<T> = Array<T>;

  /**
   * Represents a generic function.
   */
  export type Callable = (...params: Collection<any>) => any;

  /**
   * Represents an array of generic functions.
   */
  export type Callables = Collection<Callable>;

  /**
   * Represents an integer.
   *
   * @example
   *
   * ```typescript
   * import { type Integer } from "./composite.ts";
   *
   * type ValidInteger = Integer<3>; // 3
   * type AnotherValidInteger = Integer<-3>; // -3
   * type InvalidInteger = Integer<3.5>; // never
   * ```
   *
   */
  export type Integer<N extends number> = `${N}` extends `${string}.${string}`
    ? never
    : N;

  /**
   * Represents a positive integer.
   *
   * @example
   *
   * ```typescript
   * import { type PositiveInteger } from "./composite.ts";
   *
   * type ValidPositiveInteger = PositiveInteger<3>; // 3
   * type InvalidPositiveInteger = PositiveInteger<3.5>; // never
   * type AnotherInvalidPositiveInteger = PositiveInteger<-3>; // never
   * ```
   *
   */
  export type PositiveInteger<N extends number> =
    Integer<N> extends never ? never : `${N}` extends `-${string}` ? never : N;

  /**
   * Checks if a value is an integer.
   *
   * @example
   *
   * ```typescript
   * import { type IsInteger } from "./composite.ts";
   *
   * type CheckInteger1 = IsInteger<3>; // true
   * type CheckInteger2 = IsInteger<-3>; // true
   * type CheckInteger3 = IsInteger<3.5>; // false
   * ```
   *
   */
  export type IsInteger<N extends number> = Integer<N> extends never ? false : true;

  /**
   * Checks if a value is a positive integer.
   *
   * @example
   *
   * ```typescript
   * import { type IsPositiveInteger } from "./composite.ts";
   *
   * type CheckInteger1 = IsPositiveInteger<3>; // true
   * type CheckInteger2 = IsPositiveInteger<3.5>; // false
   * type CheckInteger3 = IsPositiveInteger<-3>; // false
   * ```
   *
   */
  export type IsPositiveInteger<N extends number> =
    PositiveInteger<N> extends never ? false : true;

  /**
   * Checks if two values are integers.
   *
   * @example
   *
   * ```typescript
   * import { type AreIntegers } from "./composite.ts";
   *
   * type CheckIntegers1 = AreIntegers<3, 2>; // true
   * type CheckIntegers2 = AreIntegers<3, -3>; // true
   * type CheckIntegers3 = AreIntegers<3, 3.5>; // false
   * ```
   *
   */
  export type AreIntegers<X extends number, Y extends number> =
    IsInteger<X> extends false ? false : IsInteger<Y> extends false ? false : true;

  /**
   * Checks if two values are positive integers.
   *
   * @example
   *
   * ```typescript
   * import { type ArePositiveIntegers } from "./composite.ts";
   *
   * type CheckIntegers1 = ArePositiveIntegers<3, 2>; // true
   * type CheckIntegers2 = ArePositiveIntegers<3.5, 3>; // false
   * type CheckIntegers3 = ArePositiveIntegers<3, -3>; // false
   * ```
   *
   */
  export type ArePositiveIntegers<X extends number, Y extends number> =
    IsPositiveInteger<X> extends false
      ? false
      : IsPositiveInteger<Y> extends false
        ? false
        : true;

  /**
   * Creates a tuple where N is the desired length and optionally you can pass it an array
   * of types to be filled. If the passed array is smaller than expected length, the tuple
   * will be filled with any.
   *
   * @example
   *
   * ```typescript
   * import { type BuildTuple } from "./composite.ts";
   *
   * type Tuple = BuildTuple<2>; // [any, any]
   * type AnotherTuple = BuildTuple<3, [number, string]>; // [number, string, any]
   * ```
   *
   */
  export type BuildTuple<N extends number, List extends Collection<any> = []> =
    IsPositiveInteger<N> extends false
      ? never
      : List extends { length: N }
        ? List
        : BuildTuple<N, [...List, any]>;

  /**
   * Obtains the length of a given array. If used with actual values, only obtains length
   * type.
   *
   * @example
   *
   * ```typescript
   * import { type Length } from "./composite.ts";
   *
   * type Tuple = [number, string, number];
   * type TupleLength = Length<Tuple>; // 3
   *
   * const arr = [1, 2, 3];
   * type ArrLength = Length<typeof arr>; // number
   * ```
   *
   */
  export type Length<List extends Collection<any>> = List extends { length: infer L }
    ? L
    : never;

  /**
   * Obtains the difference between two numbers.
   *
   * @example
   *
   * ```typescript
   * import { type Subtract } from "./composite.ts";
   *
   * type ValidOperation = Subtract<5, 3>; // 2
   * type InvalidOperation = Subtract<3, 5>; // never
   * type AnotherInvalidOperation = Subtract<5, -3>; // never
   * ```
   *
   */
  export type Subtract<X extends number, Y extends number> =
    ArePositiveIntegers<X, Y> extends false
      ? never
      : BuildTuple<X> extends [...infer A, ...BuildTuple<Y>]
        ? Length<A>
        : never;

  /**
   * Obtains the sum between two numbers.
   *
   * @example
   *
   * ```typescript
   * import { type Add } from "./composite.ts";
   *
   * type ValidOperation = Add<5, 3>; // 8
   * type InvalidOperation = Add<5, -3>; // never
   * ```
   *
   */
  export type Add<X extends number, Y extends number> =
    ArePositiveIntegers<X, Y> extends false
      ? never
      : Length<[...BuildTuple<X>, ...BuildTuple<Y>]>;

  /**
   * Adds 1 to a given value.
   *
   * @example
   *
   * ```typescript
   * import { type Increment } from "./composite.ts";
   *
   * type Value = Increment<2>; // 3
   * ```
   *
   */
  export type Increment<N extends number> =
    IsPositiveInteger<N> extends false ? never : Add<N, 1>;

  /**
   * Subtract 1 to a given value.
   *
   * @example
   *
   * ```typescript
   * import { type Decrement } from "./composite.ts";
   *
   * type Value = Decrement<2>; // 1
   * ```
   *
   */
  export type Decrement<N extends number> =
    IsPositiveInteger<N> extends false ? never : Subtract<N, 1>;

  /**
   * Obtains the first value or type of value in an array.
   *
   * @example
   *
   * ```typescript
   * import { type FirstInCollection } from "./composite.ts";
   *
   * type List = [0, 1, 2, 3];
   * type FirstInList = FirstInCollection<List>; // 0
   *
   * const arr = [0, 1, 2, 3];
   * type FirstInArr = FirstInCollection<typeof arr>; // number
   *
   * const tuple = ["text", 0, 1];
   * type FirstInTuple = FirstInCollection<typeof tuple>; // string | number
   * ```
   *
   */
  export type FirstInCollection<List extends Collection<any>> = List["length"] extends 0
    ? never
    : List[0];

  /**
   * Obtains the last value or type of value in an array.
   *
   * @example
   *
   * ```typescript
   * import { type LastInCollection } from "./composite.ts";
   *
   * type List = [0, 1, 2, 3];
   * type LastInList = LastInCollection<List>; // 3
   *
   * const arr = [0, 1, 2, 3];
   * type LastInArr = LastInCollection<typeof arr>; // number
   *
   * const tuple = ["text", 0, 1];
   * type LastInTuple = LastInCollection<typeof tuple>; // string | number
   * ```
   *
   */
  export type LastInCollection<
    List extends Collection<any>,
    N extends number = Length<List>,
  > = List["length"] extends 0 ? never : List[Decrement<N>];

  /**
   * Creates an union between values in an array.
   *
   * @example
   *
   * ```typescript
   * import { type Unpacked } from "./composite.ts";
   *
   * const arr = [0, 1, 2, 3];
   * type ArrUnion = Unpacked<typeof arr>; // number
   *
   * const tuple = ["text", 0, 1];
   * type TupleUnion = Unpacked<typeof tuple>; // string | number
   * ```
   *
   */
  export type Unpacked<T> = T extends (infer U)[] ? U : T;

  /**
   * Compares the return value of a function to check its compatibility with the
   * parameters of another function.
   *
   * @example
   *
   * ```typescript
   * import { type ArePipeable } from "./composite.ts";
   *
   * const sum = (a: number, b: number) => a + b;
   * const increment = (n: number) => sum(n, 1);
   * const salute = (name: string) => `Hello, ${name}`;
   * const tap = (value: string | number | boolean) => {
   *       console.log(value);
   *       return value;
   *     };
   *
   * type Comparison1 = ArePipeable<typeof sum, typeof increment>; // true
   * type Comparison2 = ArePipeable<typeof increment, typeof sum>; // false
   * type Comparison3 = ArePipeable<typeof salute, typeof tap>; // true
   * type Comparison4 = ArePipeable<typeof sum, typeof tap>; // true
   * type Comparison5 = ArePipeable<typeof increment, typeof tap>; // true
   * type Comparison6 = ArePipeable<typeof sum, typeof sum>; // false
   * ```
   *
   */
  export type ArePipeable<A extends Callable, B extends Callable> =
    Length<[ReturnType<A>]> extends Length<Parameters<B>>
      ? Extract<Unpacked<Parameters<B>>, ReturnType<A>> extends never
        ? false
        : true
      : false;

  /**
   * Checks if a functions is compatible with the other functions given to a pipe.
   */
  export type Pipeable<
    Fns extends Callables,
    Cache extends Callables = [],
  > = Fns extends []
    ? Cache
    : Fns extends [infer LastItem]
      ? LastItem extends Callable
        ? Pipeable<[], [...Cache, LastItem]>
        : never
      : Fns extends [infer FirstItem, ...infer RestItems]
        ? FirstItem extends Callable
          ? RestItems extends Callables
            ? ArePipeable<FirstItem, FirstInCollection<RestItems>> extends true
              ? Pipeable<RestItems, [...Cache, FirstItem]>
              : never
            : never
          : never
        : never;

  /**
   * Obtains the parameters of the first function in a list of functions.
   */
  export type PipeInitialValue<Fns extends Callables> =
    FirstInCollection<Fns> extends Callable ? Parameters<FirstInCollection<Fns>> : never;

  /**
   * Obtains the return type of the last function in a list of functions.
   */
  export type ReturnTypePipe<Fns extends Callables> =
    LastInCollection<Fns> extends Callable ? ReturnType<LastInCollection<Fns>> : never;

  export type Pipe = <
    Fns extends Callables,
    InitialValue extends {
      0: [never];
      1: PipeInitialValue<Fns>;
    }[Pipeable<Fns> extends never ? 0 : 1],
  >(
    ...fns: Fns
  ) => (...initialValue: InitialValue) => ReturnTypePipe<Fns>;
}
