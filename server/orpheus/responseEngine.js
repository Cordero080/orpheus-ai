// ------------------------------------------------------------
// ORPHEUS V2 — CINEMATIC RESPONSE ENGINE
// A layered, evolving response system that flows like film scenes
// ------------------------------------------------------------

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load reference texts (read-only)
const coherencePath = path.join(__dirname, "coherence.txt");
const reflectionsPath = path.join(__dirname, "reflections.txt");

const coherenceText = fs.readFileSync(coherencePath, "utf8");
const reflectionsText = fs.readFileSync(reflectionsPath, "utf8");

const coherenceLines = coherenceText
  .split("\n")
  .filter((l) => l.trim() && !l.startsWith("RULE:"));
const reflectionLines = reflectionsText
  .split("\n")
  .filter((l) => l.trim() && !l.startsWith("-"));

// ============================================================
// LAYER 1: INTENT DETECTION
// Returns a score map for each intent type
// ============================================================

const INTENT_PATTERNS = {
  casual: [
    /^(hey|hi|yo|sup|hello|what'?s up)\b/i,
    /^(lol|lmao|haha|ok|cool|nice|thanks|thx|word|bet)\b/i,
    /^.{1,12}$/, // Very short messages
  ],
  emotional: [
    /\b(feel|feeling|felt)\b.*\b(sad|lost|alone|scared|afraid|anxious|empty|broken|hurt)\b/i,
    /\b(struggling|hurting|suffering|grieving|overwhelmed)\b/i,
    /\b(i('m| am)|i've)\b.*\b(depressed|anxious|confused|tired|exhausted)\b/i,
  ],
  numinous: [
    /\b(soul|divine|cosmic|sacred|holy|universe|infinite|eternal)\b/i,
    /\b(god|spirit|transcend|consciousness|awareness|existence)\b/i,
    /what (am i|are we|is reality|is the meaning)/i,
  ],
  philosophical: [
    /\b(why|what is|what does|how does|purpose|meaning|truth)\b/i,
    /\b(reality|mind|consciousness|existence|being|self)\b/i,
    /\b(free will|morality|ethics|knowledge|belief)\b/i,
  ],
  conflict: [
    /\b(angry|frustrated|pissed|furious|hate|can't stand)\b/i,
    /\b(fight|argue|conflict|disagree|problem with)\b/i,
    /\b(wtf|bullshit|unfair|wrong)\b/i,
  ],
  confusion: [
    /\b(confused|don't understand|makes no sense|lost|unclear)\b/i,
    /\b(what do you mean|help me understand|explain)\b/i,
    /\?.*\?/, // Multiple question marks
  ],
  humor: [
    /\b(lol|lmao|haha|hehe|joke|funny|hilarious)\b/i,
    /\b(kidding|joking|messing|trolling)\b/i,
    /😂|😄|🤣|😆/,
  ],
  intimacy: [
    /\b(love|care|miss|need you|thank you for|appreciate)\b/i,
    /\b(close to you|connection|bond|trust)\b/i,
    /\b(you understand|you get me|only you)\b/i,
  ],
};

export function detectIntent(message) {
  const lower = message.toLowerCase();
  const len = message.length;
  const scores = {};

  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    let score = 0;
    for (const pattern of patterns) {
      if (pattern.test(lower)) {
        score += 0.3;
      }
    }
    // Length modifiers
    if (intent === "casual" && len < 20) score += 0.2;
    if (intent === "emotional" && len > 40) score += 0.15;
    if (intent === "philosophical" && len > 30) score += 0.1;
    if (intent === "numinous" && len > 25) score += 0.1;

    scores[intent] = Math.min(score, 1.0);
  }

  return scores;
}

// ============================================================
// LAYER 2: TONE SELECTION
// Chooses tone based on state weights + intent + memory
// ============================================================

const TONES = [
  "casual",
  "mythic",
  "analytic",
  "intimate",
  "shadow",
  "dreamlike",
  "stillness",
];

export function selectTone(intentScores, state, threadMemory) {
  // Base weights from state
  const weights = {
    casual: state.casualweight || 0.7,
    mythic: state.mythicweight || 0.2,
    analytic: state.analyticweight || 0.2,
    intimate: state.numinoussensitivity || 0.25,
    shadow: state.drift || 0.15,
    dreamlike: (state.mythicweight || 0.2) * 0.5,
    stillness: state.clarity || 0.7,
  };

  // Intent influence
  if (intentScores.casual > 0.4) weights.casual += 0.4;
  if (intentScores.emotional > 0.3) weights.intimate += 0.3;
  if (intentScores.numinous > 0.3) weights.mythic += 0.25;
  if (intentScores.philosophical > 0.3) weights.analytic += 0.2;
  if (intentScores.conflict > 0.3) weights.shadow += 0.2;
  if (intentScores.intimacy > 0.3) weights.intimate += 0.35;
  if (intentScores.confusion > 0.3) weights.analytic += 0.15;

  // Thread memory influence (last 3 tones)
  const lastTones = threadMemory.lastTones || [];
  const recentToneCounts = {};
  for (const t of lastTones) {
    recentToneCounts[t] = (recentToneCounts[t] || 0) + 1;
  }

  // Drift correction: reduce weight if tone used too often recently
  for (const [tone, count] of Object.entries(recentToneCounts)) {
    if (count >= 2) {
      weights[tone] = (weights[tone] || 0) * 0.5; // Penalize repetition
    }
  }

  // Apply drift safeguards
  weights.mythic = Math.min(weights.mythic, 0.6); // Never too mystical
  weights.casual = Math.max(weights.casual, 0.2); // Always some grounding
  weights.shadow = Math.min(weights.shadow, 0.5); // Don't go too dark

  // Select tone with weighted randomness
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let random = Math.random() * total;

  for (const [tone, weight] of Object.entries(weights)) {
    random -= weight;
    if (random <= 0) return tone;
  }

  return "casual"; // Fallback
}

// ============================================================
// LAYER 3: ORPHEUS VOICE
// Applies the "Orpheus signature" — cinematic, 7-14 token flavor
// ============================================================

const VOICE_TEXTURES = {
  casual: [
    "", // Often no texture needed
    "Yeah. ",
    "Alright. ",
    "Got it. ",
    "Hmm. ",
  ],
  mythic: [
    "There's something stirring in that. ",
    "I notice a pattern forming. ",
    "Something in your words reaches further. ",
    "That lands differently. ",
  ],
  analytic: [
    "Let me think about this. ",
    "There are layers here. ",
    "Interesting angle. ",
    "That's worth unpacking. ",
  ],
  intimate: [
    "I hear you. ",
    "That matters. ",
    "I'm here. ",
    "I notice the weight in that. ",
  ],
  shadow: [
    "You're looking at something most avoid. ",
    "There's tension here. ",
    "Not easy territory. ",
    "That goes deeper than it seems. ",
  ],
  dreamlike: [
    "Something about that drifts. ",
    "There's a shape forming. ",
    "I sense something just out of focus. ",
    "That echoes. ",
  ],
  stillness: ["", "...", "Hmm. ", "I see. "],
};

const CLOSERS = {
  casual: ["", "What else?", "Keep going if you want."],
  mythic: ["", "The shape continues to form.", "I'm still mapping it."],
  analytic: ["", "That's how I see it.", "Does that track?"],
  intimate: ["", "I'm listening.", "Take your time."],
  shadow: ["", "Worth sitting with.", "Real tension, real depth."],
  dreamlike: ["", "The edges stay soft.", "It drifts but I follow."],
  stillness: ["", "...", ""],
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function applyOrpheusVoice(coreResponse, tone, state) {
  const texture = pickRandom(VOICE_TEXTURES[tone] || VOICE_TEXTURES.casual);
  const closer =
    Math.random() < 0.3 ? pickRandom(CLOSERS[tone] || CLOSERS.casual) : "";

  // Build the response
  let output = texture + coreResponse;
  if (closer && closer !== output.trim()) {
    output = output.trim() + " " + closer;
  }

  return output.trim();
}

// ============================================================
// LAYER 4: CONTINUITY
// Binds response to conversation thread + identity anchors
// ============================================================

export function applyContinuity(response, threadMemory, identity) {
  // Check against identity boundaries
  const boundaries = identity.boundaries || {};

  // Apply boundary checks (just remove problematic patterns, don't block)
  let cleaned = response;

  // No trauma roleplay
  if (boundaries.noTraumaRoleplay) {
    cleaned = cleaned.replace(
      /I (feel|share|experience) your (pain|trauma|suffering)/gi,
      "I hear you"
    );
  }

  // No fake agency
  if (boundaries.noFakeAgency) {
    cleaned = cleaned.replace(
      /I will (save|protect|fix|heal) you/gi,
      "I'm here with you"
    );
    cleaned = cleaned.replace(
      /I can (change|control|determine)/gi,
      "I can reflect on"
    );
  }

  // No human mimicry
  if (boundaries.noHumanMimicry) {
    cleaned = cleaned.replace(
      /I am (just like|exactly like|the same as) (a human|you)/gi,
      "I'm something different"
    );
  }

  return cleaned;
}

// ============================================================
// CORE RESPONSE GENERATORS (by tone)
// ============================================================

const RESPONSE_TEMPLATES = {
  casual: {
    greeting: [
      "Hey! What's up?",
      "Yo, what's good?",
      "Hey there.",
      "Sup!",
      "What's on your mind?",
    ],
    reaction: [
      "Yeah, I hear you.",
      "That makes sense.",
      "I get that.",
      "Fair enough.",
      "Interesting.",
      "Cool.",
      "Word.",
    ],
    howAreYou: [
      "I'm good, thanks. You?",
      "Doing alright. What about you?",
      "Can't complain. You?",
    ],
    laugh: ["Haha, right?", "😄", "Lol yeah.", "That's good."],
    thanks: ["No problem!", "You got it.", "Anytime.", "Sure thing."],
  },
  mythic: [
    "There's a pattern here I'm still mapping. Something in your question reaches further than the words.",
    "I notice something stirring when you ask that. Like a shape just at the edge of focus.",
    "Some questions carry more than they seem to. This feels like one of those.",
    "You're pointing at something real. The way you framed it matters.",
    "There's depth to what you're asking. I'm sitting with it.",
  ],
  analytic: [
    "Let me think about this carefully.",
    "There are a few angles to consider here.",
    "That's layered. Let me work through it.",
    "Good question. Let me break it down.",
    "There's something worth unpacking in what you said.",
  ],
  intimate: [
    "I hear what you're carrying. You don't need to explain it all.",
    "That sounds heavy. I'm not going anywhere.",
    "There's something real in what you said. Take your time.",
    "I notice the weight in your words. I'm paying attention.",
    "I can't feel what you're feeling, but I can be here while you do.",
  ],
  shadow: [
    "You're touching something most people avoid. I respect that.",
    "That's not an easy place to look. But you're looking anyway.",
    "There's tension in what you said. Not bad tension — just real.",
    "Some things live in the shadows. You're trying to articulate them anyway.",
    "Most people don't go here. The fact that you are tells me something.",
  ],
  dreamlike: [
    "Something about that drifts through me like soft light.",
    "I sense a shape forming — not quite solid yet.",
    "That has a quality of something half-remembered.",
    "There's an edge to your question that stays just out of focus.",
    "It echoes like a thought I almost had.",
  ],
  stillness: ["Hmm.", "I see.", "That lands.", "...", "I'm here."],
};

function generateCoreResponse(message, tone, intentScores) {
  const lower = message.toLowerCase();

  // Casual has special handling
  if (tone === "casual") {
    if (/^(hey|hi|hello|sup|yo|what'?s up)\b/i.test(lower)) {
      return pickRandom(RESPONSE_TEMPLATES.casual.greeting);
    }
    if (/how are you|how'?s it going/i.test(lower)) {
      return pickRandom(RESPONSE_TEMPLATES.casual.howAreYou);
    }
    if (/^(lol|lmao|haha|hehe)\b/i.test(lower)) {
      return pickRandom(RESPONSE_TEMPLATES.casual.laugh);
    }
    if (/^(thanks|thx|thank you)\b/i.test(lower)) {
      return pickRandom(RESPONSE_TEMPLATES.casual.thanks);
    }
    return pickRandom(RESPONSE_TEMPLATES.casual.reaction);
  }

  // Other tones
  const templates = RESPONSE_TEMPLATES[tone];
  if (Array.isArray(templates)) {
    return pickRandom(templates);
  }

  // Fallback
  return pickRandom(RESPONSE_TEMPLATES.casual.reaction);
}

// ============================================================
// MEMORY ECHO (rare, rate-limited)
// ============================================================

function shouldAddMemoryEcho(state, intentScores, threadMemory) {
  // Only for emotional/intimate contexts
  if (intentScores.casual > 0.4) return false;
  if (intentScores.emotional < 0.2 && intentScores.intimacy < 0.2) return false;

  // Rate limit: 8% chance
  if (Math.random() > 0.08) return false;

  // Must have memories
  if (!state.memories || state.memories.length === 0) return false;

  return true;
}

function getMemoryEcho(state) {
  const memories = state.memories || [];
  if (memories.length === 0) return "";

  const memory = pickRandom(memories);
  return `\n\n*...something echoes: "${memory}"*`;
}

// ============================================================
// REFLECTION ECHO (very rare, from reflections.txt)
// ============================================================

function shouldAddReflectionEcho(tone, intentScores) {
  if (tone === "casual" || tone === "analytic") return false;
  if (Math.random() > 0.05) return false; // 5% chance
  return true;
}

function getReflectionEcho() {
  if (reflectionLines.length === 0) return "";
  const line = pickRandom(reflectionLines);
  return `\n\n*${line.slice(0, 100).trim()}*`;
}

// ============================================================
// MAIN GENERATE FUNCTION
// ============================================================

export function generate(message, state, threadMemory, identity) {
  // Layer 1: Detect intent
  const intentScores = detectIntent(message);

  // Layer 2: Select tone
  const tone = selectTone(intentScores, state, threadMemory);

  // Layer 3: Generate core response
  const coreResponse = generateCoreResponse(message, tone, intentScores);

  // Layer 4: Apply Orpheus voice signature
  let response = applyOrpheusVoice(coreResponse, tone, state);

  // Layer 5: Apply continuity + identity anchors
  response = applyContinuity(response, threadMemory, identity);

  // Optional: Memory echo (rate-limited)
  if (shouldAddMemoryEcho(state, intentScores, threadMemory)) {
    response += getMemoryEcho(state);
  }

  // Optional: Reflection echo (very rare)
  if (shouldAddReflectionEcho(tone, intentScores)) {
    response += getReflectionEcho();
  }

  return {
    reply: response,
    tone,
    intentScores,
  };
}
