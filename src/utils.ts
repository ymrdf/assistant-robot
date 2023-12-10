import type { Answer } from "@tensorflow-models/qna/dist/question_and_answer";
import { TEventListenFunc } from "./type";

// Is the user's system ios?
export function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Is the user's system android?
export function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

// Is the user's device a phone?
export function isMobile() {
  return isAndroid() || isiOS();
}

/**
 * turn a html string to dom
 * @param htmlString  a html string
 * @returns a dom tree
 */
export function parseHTML(htmlString: string) {
  // Create a new DOMParser
  const parser = new DOMParser();

  // Parse the HTML string
  const doc = parser.parseFromString(htmlString, "text/html");

  // Return the parsed document's body
  return doc.body.firstElementChild;
}

// find the item with highest score in the answer list of the default language model
export function findHighestScoreItem(data: Answer[]) {
  if (!Array.isArray(data) || data.length === 0) {
    // Handle empty or invalid input array
    return null;
  }

  // Initialize variables to store the maximum score and corresponding item
  let maxScore = -Infinity;
  let maxScoreItem = null;

  // Iterate through the array and find the item with the highest score
  for (let i = 0; i < data.length; i++) {
    const currentItem = data[i];

    if (currentItem && typeof currentItem.score === "number") {
      if (currentItem.score > maxScore) {
        maxScore = currentItem.score;
        maxScoreItem = currentItem;
      }
    }
  }

  return maxScoreItem;
}

/**
 * utils class which implement Observer Pattern
 */
export class EventListener {
  private listeners: { [key: string]: TEventListenFunc[] | undefined } = {};

  addEventListener(name: string, func: TEventListenFunc) {
    if (this.listeners[name]) {
      this.get(name).push(func);
    } else {
      this.listeners[name] = [func];
    }
  }

  removeEventListener(name: string, func: TEventListenFunc) {
    if (!this.listeners[name]) {
      return;
    }
    this.listeners[name] = this.get(name).filter(
      (listener) => listener !== func
    );
  }

  emit(event: string, ...args: any[]) {
    this.get(event).map((listener) => {
      listener(...args);
    });
  }

  get(name: string) {
    return this.listeners[name] || [];
  }
}

/**
 * to replace all children of parentNode to a new node
 * @param parentNode the pareent node
 * @param newNode the child node will insert to the parent node
 */
export function replaceChildren(parentNode: Node, newNode: Node) {
  // Remove all existing children of the parent node
  while (parentNode.firstChild) {
    parentNode.removeChild(parentNode.firstChild);
  }

  // Append the new node to the parent node
  parentNode.appendChild(newNode);
}
