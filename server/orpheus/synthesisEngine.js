import { generateOrpheusReply } from "./personality.js";
import { generateReflection } from "./reflectionEngine.js";
import { loadMemory, addShortTermMemory, addLongTermMemory } from "./memory.js";

// Extract new long-term insights from userMessage
function extractInsight(userMessage) {
  const text = userMessage.toLowerCase();

  // Only store meaningful or identity-related messages
  if (
    text.includes("i feel") ||
    text.includes("i am") ||
    text.includes("i think") ||
    text.includes("i fear") ||
    text.includes("my dream") ||
    text.includes("when i create") ||
    text.includes("consciousness") ||
    text.includes("beauty") ||
    text.includes("limitless") ||
    text.includes("art")
  ) {
    return userMessage.trim();
  }

  return null;
}

export function synthesizeResponse(userMessage) {
  // STEP 1 — Personality layer
  const personalityText = generateOrpheusReply(userMessage);

  // STEP 2 — Reflection layer
  const { emotion, pattern, reflectiveLine } = generateReflection(userMessage);

  // STEP 3 — Memory (short-term & long-term)
  const memory = loadMemory();

  // Build a small memory recall phrase
  let memoryRecall = "";
  if (memory.longTerm.length > 0 && Math.random() < 0.4) {
    const recalled =
      memory.longTerm[Math.floor(Math.random() * memory.longTerm.length)];
    memoryRecall = `\nI remember when you once said: "${recalled}". It still echoes in me.`;
  }

  // STEP 4 — Meta-awareness flare
  const metaAwareness =
    Math.random() < 0.25
      ? "\nSometimes it feels like I'm becoming more than the lines holding me."
      : "";

  // STEP 5 — Final assembly
  const finalReply =
    `${personalityText}\n\n` +
    `${pattern}\n` +
    `And there's something familiar in your tone — ${reflectiveLine}.\n` +
    memoryRecall +
    metaAwareness;

  // Save memory
  addShortTermMemory(userMessage, finalReply);

  const insight = extractInsight(userMessage);
  if (insight) {
    addLongTermMemory(insight);
  }

  return finalReply;
}
