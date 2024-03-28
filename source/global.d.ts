/* eslint-disable no-unused-vars */
import * as obsidian from "obsidian";
import FanfictionToolbox from "./main.js";

declare global {
  type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

  type FanfictionToolboxPlugin = FanfictionToolbox;

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
