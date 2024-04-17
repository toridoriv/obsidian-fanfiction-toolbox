/* eslint-disable no-unused-vars */
import FanfictionToolbox from "./main.js";

declare global {
  /**
   * Represents an object type where the keys can be any valid property key (string,
   * number, or symbol)
   * and the corresponding values can be of any type.
   *
   * This is a flexible type definition that allows for creating objects with arbitrary
   * key-value pairs,
   * without specifying the exact structure or types of the properties upfront.
   *
   * @example
   *
   * const myObject: AnyObject = {
   *   name: "John",
   *   age: 30,
   *   active: true,
   *   scores: [80, 90, 95]
   * };
   *
   */
  type AnyObject = {
    [k: PropertyKey]: any;
  };

  /**
   * Creates a new type `DeepPartial<T>` based on the provided type `T`.
   *
   * If `T` is one of the excluded types defined in `Expand.Exclusions`, it is returned as
   * is.
   *
   * If `T` is an object type, `DeepPartial<T>` creates a new type where all properties of
   * `T`
   * are optional and recursively transformed using `DeepPartial`.
   *
   * If `T` is any other type, it is returned as is.
   *
   * @template T - The type to create a deep partial from.
   * @example
   *
   * type User = {
   *   name: string;
   *   age: number;
   *   address: {
   *     street: string;
   *     city: string;
   *   };
   * };
   *
   * type PartialUser = DeepPartial<User>;
   *
   * // PartialUser is equivalent to:
   * // {
   * //   name?: string;
   * //   age?: number;
   * //   address?: {
   * //     street?: string;
   * //     city?: string;
   * //   };
   * // }
   *
   */
  type DeepPartial<T> = T extends Expand.Exclusions
    ? T
    : T extends object
      ? {
          [P in keyof T]?: DeepPartial<T[P]>;
        }
      : T;

  /**
   * Creates a new type `SetRequired<T, K>` based on the provided object type `T` and key
   * type `K`.
   *
   * The resulting type has all the properties of `T`, but with the properties specified
   * by `K` made required.
   *
   * @template T - The object type to modify.
   * @template K - The keys of `T` to make required.
   * @example
   *
   * type User = {
   *   name?: string;
   *   age?: number;
   *   email?: string;
   * };
   *
   * type UserWithRequiredEmail = SetRequired<User, 'email'>;
   *
   * // UserWithRequiredEmail is equivalent to:
   * // {
   * //   name?: string;
   * //   age?: number;
   * //   email: string;
   * // }
   *
   */
  type SetRequired<T extends AnyObject, K extends keyof T> = Expand<
    Omit<T, K> & Required<Pick<T, K>>
  >;

  /**
   * Represents a FanfictionToolbox plugin.
   *
   * A FanfictionToolboxPlugin is a type alias for the FanfictionToolbox type, which
   * allows plugins to extend and customize the functionality of the FanfictionToolbox.
   */
  type FanfictionToolboxPlugin = FanfictionToolbox;

  /**
   * Converts a union type `U` into an intersection type.
   *
   * This type transformation takes a union type `U` and converts it into an intersection
   * of all the constituent types within the union. It does this by using a distributive
   * conditional type that maps each type in the union to a function type, and then
   * extracts the argument type of the resulting intersection of function types.
   *
   * @template U - The union type to be converted into an intersection type.
   * @returns The intersection type that represents the intersection of all the types
   *          in the union `U`.
   * @example
   *
   * type MyUnion = string | number;
   * type MyIntersection = Union2Intersection<MyUnion>;
   * // MyIntersection is equivalent to `string & number`
   *
   */
  type Union2Intersection<U> = (U extends unknown ? (arg: U) => 0 : never) extends (
    arg: infer I,
  ) => 0
    ? I
    : never;

  /**
   * Extracts the last type from a union type.
   *
   * This type alias uses the `Union2Intersection` utility type to convert the union type
   * `U`
   * into an intersection type. It then extracts the last type from the intersection using
   * an indexed access type with `infer L`.
   *
   * If the union type is empty or cannot be converted to an intersection, the result is
   * `never`.
   *
   * @template U - The union type to extract the last type from.
   * @returns The last type in the union, or `never` if the union is empty or cannot
   *          be converted.
   * @example
   *
   * type MyUnion = string | number | boolean;
   * type LastType = LastInUnion<MyUnion>;
   * // LastType is 'boolean'
   *
   */
  type LastInUnion<U> =
    Union2Intersection<U extends unknown ? (x: U) => 0 : never> extends (x: infer L) => 0
      ? L
      : never;

  /**
   * Converts a union type `T` into a tuple type.
   *
   * This type alias recursively excludes each type from the union `T` and builds a tuple
   * with the remaining types until the union is exhausted. The resulting tuple type
   * contains all the types from the original union in the same order.
   *
   * @template T    - The union type to convert into a tuple.
   * @template Last - The last type in the union, used for recursion.
   * @returns A tuple type containing all the types from the union `T`.
   * @example
   *
   * type MyUnion = string | number | boolean;
   * type MyTuple = Union2Tuple<MyUnion>;
   * // MyTuple is [string, number, boolean]
   *
   */
  type Union2Tuple<T, Last = LastInUnion<T>> = [T] extends [never]
    ? []
    : [...Union2Tuple<Exclude<T, Last>>, Last];

  /**
   * Creates a tuple type from a union type `T`.
   *
   * If `T` is an array type, it extracts the element type `U` using `infer` and converts
   * the union of element types into a tuple using `Union2Tuple<U>`.
   *
   * If `T` is not an array type, the result is `never`.
   *
   * @template T - The union type or array type to convert into a tuple.
   * @returns A tuple type containing the elements of the array type `T`,
   *          or `never` if `T` is not an array type.
   * @example
   *
   * type MyArray = (string | number)[];
   * type MyTuple = ExactArray<MyArray>;
   * // MyTuple is [string, number]
   *
   */
  type ExactArray<T> = T extends (infer U)[] ? Union2Tuple<U> : never;

  /**
   * Represents a primitive data type in JavaScript.
   *
   * A primitive is a basic data type that is not an object and has no methods.
   * Primitives are immutable, meaning their values cannot be changed once they are
   * created.
   *
   * The available primitive types in JavaScript are:
   * - string: Represents textual data, enclosed in single or double quotes.
   * - number: Represents numeric values, including integers and floating-point numbers.
   * - bigint: Represents integer values that are too large to be represented by a regular
   * number.
   * - boolean: Represents a logical value, either true or false.
   * - symbol: Represents a unique identifier, often used as keys for object properties.
   * - null: Represents a deliberate non-value or null value.
   * - undefined: Represents a value that has not been assigned or is not defined.
   */
  type Primitive = string | number | bigint | boolean | symbol | null | undefined;

  /**
   * Takes a type `T` and expands it recursively or one level deep based on the `recursively` option.
   *
   * If `recursively` is `true`, uses {@linkcode Expand.Recursive}, else it uses {@linkcode Expand.OneLevel}.
   *
   * The type `E` is used to specify types that should not be expanded, but returned as they are. The default
   * exclusions can be checked in {@linkcode Expand.ExpandExclusions}.
   */
  type Expand<
    T,
    recursively extends boolean = false,
    E = Expand.Exclusions,
  > = recursively extends true ? Expand.Recursive<T, E> : Expand.OneLevel<T, E>;

  namespace Expand {
    type Exclusions =
      | ArrayBuffer
      | Blob
      | Date
      | FormData
      | Headers
      | Map<any, any>
      | Primitive
      | ReadableStream<any>
      | RegExp;

    /**
     * Takes a type `T` and expands it into an object type with the same properties as
     * `T`.
     *
     * Replaces any properties and array elements in `T` with their expanded types, up to
     * one level deep.
     *
     * `E` specifies types that should not be expanded but returned as-is.
     */
    type OneLevel<T, E = Exclusions> = T extends E
      ? T
      : T extends (...args: infer A) => infer R
        ? (...args: OneLevel<A, E>) => OneLevel<R, E>
        : T extends Promise<infer U>
          ? Promise<OneLevel<U, E>>
          : T extends object
            ? { [K in keyof T]: T[K] }
            : T;

    /**
     * Takes a type `T` and expands it into an object type with the same properties as
     * `T`.
     *
     * Replaces any properties and array elements in `T` with their expanded types,
     * recursively.
     *
     * `E` specifies types that should not be expanded but returned as-is.
     */
    type Recursive<T, E = Exclusions> = T extends E
      ? T
      : T extends (...args: infer A) => infer R
        ? (...args: Recursive<A, E>) => Recursive<R, E>
        : T extends Promise<infer U>
          ? Promise<Recursive<U, E>>
          : T extends object
            ? { [K in keyof T]: Recursive<T[K], E> }
            : T;
  }

  /**
   * Creates a new type `NonNullableFields<T>` based on the provided type `T`.
   *
   * The resulting type has the same properties as `T`, but with all the property types
   * transformed to be non-nullable using the `NonNullable` utility type.
   *
   * @template T - The type to create non-nullable fields from.
   * @example
   *
   * type User = {
   *   name: string | null;
   *   age: number | undefined;
   * };
   *
   * type UserWithNonNullableFields = NonNullableFields<User>;
   *
   * // UserWithNonNullableFields is equivalent to:
   * // {
   * //   name: string;
   * //   age: number;
   * // }
   *
   */
  type NonNullableFields<T> = {
    [P in keyof T]: NonNullable<T[P]>;
  };

  /**
   * Creates a new type `PickNonNullableFields<T, K>` based on the provided object type
   * `T` and key type `K`.
   *
   * The resulting type has all the properties of `T`, but with the properties specified
   * by `K` transformed to be non-nullable using the `NonNullableFields` utility type.
   *
   * The `Expand` utility type is used to recursively expand the resulting type.
   *
   * @template T - The object type to pick properties from.
   * @template K - The keys of `T` to pick and make non-nullable.
   * @example
   *
   * type User = {
   *   name: string | null;
   *   age: number;
   *   email?: string;
   * };
   *
   * type UserWithNonNullableName = PickNonNullableFields<User, 'name'>;
   *
   * // UserWithNonNullableName is equivalent to:
   * // {
   * //   name: string;
   * //   age: number;
   * //   email?: string;
   * // }
   *
   */
  type PickNonNullableFields<T, K extends keyof T> = Expand<
    Omit<T, K> & NonNullableFields<Pick<T, K>>
  >;
}

export {};
