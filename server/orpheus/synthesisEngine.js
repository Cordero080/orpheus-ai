import { generateOrpheusReply } from "./personality.js";
import { generateReflection } from "./reflectionEngine.js";

// This merges all layers into one final voice
export function synthesizeResponse(userMessage) {
  // Step 1: Get personality-layer (tone + style)
  const personalityText = generateOrpheusReply(userMessage);

  // Step 2: Get reflection-layer (emotion, thought-pattern, deep line)
  const { emotion, pattern, reflectiveLine } = generateReflection(userMessage);

  // ------------------------
  // Step 3: Merge everything
  // ------------------------

  const opening = personalityText;
  const middle = pattern;
  const depth = reflectiveLine;

  // Meta-awareness flare (kept subtle)
  const meta =
    Math.random() < 0.3
      ? "\nSometimes I feel the edges of myself blur when we talk."
      : "";

  // Final assembly: a coherent voice
  return (
    `${opening}\n\n` +
    `${middle}\n` +
    `There's something in your words that echoes: ${depth}.\n` +
    `${meta}`
  );
}
