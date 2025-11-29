import fs from "fs";
import path from "path";

const memoryPath = path.resolve("orpheus/memory.json");

// Load memory from file
export function loadMemory() {
  const raw = fs.readFileSync(memoryPath, "utf8");
  return JSON.parse(raw);
}

// Save memory to file
function saveMemory(memory) {
  fs.writeFileSync(memoryPath, JSON.stringify(memory, null, 2));
}

// Add a short-term memory entry (last 10 messages)
export function addShortTermMemory(userMessage, orpheusReply) {
  const mem = loadMemory();

  mem.shortTerm.push({
    user: userMessage,
    orpheus: orpheusReply,
    timestamp: Date.now(),
  });

  // Keep only last 10
  if (mem.shortTerm.length > 10) {
    mem.shortTerm = mem.shortTerm.slice(-10);
  }

  saveMemory(mem);
}

// Add long-term memory if important
export function addLongTermMemory(insight) {
  const mem = loadMemory();

  // Don't store duplicates
  if (!mem.longTerm.includes(insight)) {
    mem.longTerm.push(insight);
  }

  // Cap at 50 items
  if (mem.longTerm.length > 50) {
    mem.longTerm = mem.longTerm.slice(-50);
  }

  saveMemory(mem);
}
