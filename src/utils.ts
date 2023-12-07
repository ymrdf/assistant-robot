import type { Answer } from "@tensorflow-models/qna/dist/question_and_answer";

export function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

export function isMobile() {
  return isAndroid() || isiOS();
}

export function parseHTML(htmlString: string) {
  // Create a new DOMParser
  const parser = new DOMParser();

  // Parse the HTML string
  const doc = parser.parseFromString(htmlString, "text/html");

  // Return the parsed document's body
  return doc.body.firstElementChild;
}

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
