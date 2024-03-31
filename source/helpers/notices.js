import { Notice } from "obsidian";

/**
 * @param {string} message
 */
function showSuccess(message) {
  new Notice(`✨ ${message}`);
}

/**
 * @param {string} message
 */
function showFailure(message) {
  new Notice(`❌ ${message}`);
}

/**
 * @param {string} message
 */
function showWarning(message) {
  const fragment = document.createDocumentFragment();
  const emoji = document.createElement("span");

  emoji.innerHTML = "⚠️";
  emoji.classList.add("emoji");

  fragment.append(emoji, " ", message);

  new Notice(fragment);
}

export { showFailure, showSuccess, showWarning };
