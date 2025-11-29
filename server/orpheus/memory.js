// ----------------------------------------------
// ORPHEUS MEMORY ENGINE (in-memory for now)
// Stores recent exchanges + computes emotional drift
// ----------------------------------------------

const MAX_MEMORY = 50;

// Each entry: { userMessage, reply, vibe, timestamp }
const memory = [];

/**
 * Save one interaction into Orpheus' memory.
 */
export function addMemoryEntry({ userMessage, reply, vibe }) {
  memory.push({
    userMessage,
    reply,
    vibe,
    timestamp: Date.now(),
  });

  // limit memory size
  if (memory.length > MAX_MEMORY) {
    memory.shift();
  }
}

/**
 * Get last N exchanges (for future UI / debugging / memory-based behavior).
 */
export function getRecentMemory(limit = 5) {
  return memory.slice(-limit);
}

/**
 * Compute "emotional drift" from the last N entries.
 * Returns: "emotional", "chaotic", "philosophical", "playful", or "neutral"
 */
export function getEmotionalDrift(windowSize = 10) {
  if (memory.length === 0) return "neutral";

  const slice = memory.slice(-windowSize);

  const counts = {
    emotional: 0,
    chaotic: 0,
    philosophical: 0,
    playful: 0,
    neutral: 0,
  };

  for (const entry of slice) {
    if (!counts[entry.vibe]) counts[entry.vibe] = 0;
    counts[entry.vibe]++;
  }

  // find the vibe with highest count
  let bestVibe = "neutral";
  let bestCount = -1;

  for (const [vibe, count] of Object.entries(counts)) {
    if (count > bestCount) {
      bestCount = count;
      bestVibe = vibe;
    }
  }

  return bestVibe;
}
