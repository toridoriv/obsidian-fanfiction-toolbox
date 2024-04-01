/* eslint-disable no-unused-vars */
import * as obsidian from "obsidian";
import FanfictionToolbox from "./main.js";

declare global {
  type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

  type FanfictionToolboxPlugin = FanfictionToolbox;

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
      | ReadableStream<any>;

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

  namespace Obsidian {
    type Command = obsidian.Command;
    type CommandEditorCallback = (
      this: FanfictionToolboxPlugin,
      editor: Editor,
      ctx: MarkdownView | MarkdownFileInfo,
    ) => any;
    type Editor = obsidian.Editor;
    type RibbonCallback = (this: FanfictionToolboxPlugin, evt: MouseEvent) => void;
    type MarkdownView = obsidian.MarkdownView;
    type MarkdownFileInfo = obsidian.MarkdownFileInfo;
  }
}

export {};
