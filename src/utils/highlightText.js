import React from "react";

/**
 * Wraps matches of `query` terms in `text` with <mark> spans for highlighting.
 * Case-insensitive, supports multi-word queries (e.g. "google sde" highlights both).
 * Returns array of strings and React elements (use as children in JSX).
 */
export const highlightMatch = (text, query) => {
  if (!text || typeof text !== "string") return text;
  if (!query || typeof query !== "string" || !query.trim()) return text;

  const terms = query.trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return text;

  let result = [text];
  let key = 0;

  for (const term of terms) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    const next = [];
    for (const chunk of result) {
      if (typeof chunk !== "string") {
        next.push(chunk);
        continue;
      }
      const parts = chunk.split(regex);
      for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 1) {
          next.push(
            React.createElement(
              "mark",
              {
                key: key++,
                className: "bg-indigo-200 dark:bg-indigo-900/60 text-indigo-900 dark:text-indigo-100 rounded px-0.5"
              },
              parts[i]
            )
          );
        } else {
          next.push(parts[i]);
        }
      }
    }
    result = next;
  }

  return result;
};
