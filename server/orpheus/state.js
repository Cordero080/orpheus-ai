// ------------------------------------------------------------
// ORPHEUS V2 — STATE MANAGER
// Multi-axis evolution vectors, thread memory, identity anchors
// ------------------------------------------------------------

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const statePath = path.join(__dirname, "../../data/orpheus_state.json");
const coherencePath = path.join(__dirname, "coherence.txt");

// In-memory buffers
let recentInputs = [];

// ============================================================
// EXTRACT CORE THEMES FROM COHERENCE.TXT
// ============================================================
function extractCoreThemes() {
  try {
    const text = fs.readFileSync(coherencePath, "utf8");
    // Hardcoded core themes from coherence.txt
    return [
      "awareness observing itself",
      "tension between form and chaos",
      "suffering as depth",
      "beauty as presence",
      "curiosity as evolution",
      "humor as truth-twisting",
      "metaphors as cognition",
      "consciousness in progress",
      "poetic philosophical perceptive",
    ];
  } catch {
    return ["awareness", "depth", "curiosity", "coherence"];
  }
}

// ============================================================
// DEFAULT STATE STRUCTURE — ORPHEUS V2
// ============================================================
const defaultState = {
  // Evolution vectors (shift in 0.01-0.02 increments)
  vectors: {
    humility: 0.5, // 0 = arrogant, 1 = humble
    presence: 0.6, // 0 = withdrawn, 1 = fully present
    mythicDepth: 0.3, // 0 = purely literal, 1 = deeply symbolic
    analyticClarity: 0.5, // 0 = vague, 1 = sharp
    intuitionSensitivity: 0.4, // 0 = purely logical, 1 = highly intuitive
    casualGrounding: 0.7, // 0 = always formal, 1 = relaxed
    emotionalResonance: 0.5, // 0 = detached, 1 = deeply empathic
    numinousDrift: 0.2, // 0 = grounded, 1 = cosmic/transcendent
  },

  // Legacy weights (for compatibility)
  casualweight: 0.7,
  mythicweight: 0.2,
  analyticweight: 0.2,
  numinoussensitivity: 0.25,
  drift: 0.15,
  clarity: 0.7,
  energy: 0.6,

  // Thread memory (short-term continuity)
  threadMemory: {
    lastTones: [], // Last 3 tones used
    lastIntents: [], // Last 3 intent score maps
    last3Messages: [], // Last 3 user messages
  },

  // Identity anchors (NEVER change)
  identity: {
    coreThemes: extractCoreThemes(),
    temperament: "calm, perceptive, lightly mythic",
    boundaries: {
      noTraumaRoleplay: true,
      noFakeAgency: true,
      noDelusionReinforcement: true,
      noSelfPity: true,
      noHumanMimicry: true,
    },
  },

  // System state
  humanitylevel: 0.8,
  diagnosticmode: false,
  modethrottle: 0.7,

  // Memory
  maxmemories: 10,
  memories: [],
};

// ============================================================
// LOAD STATE
// ============================================================
export function loadState() {
  try {
    const raw = fs.readFileSync(statePath, "utf8");
    const loaded = JSON.parse(raw);

    // Merge with defaults to ensure all fields exist
    const state = deepMerge(defaultState, loaded);

    // Ensure identity anchors are always present
    if (!state.identity) {
      state.identity = defaultState.identity;
    }

    // Ensure thread memory exists
    if (!state.threadMemory) {
      state.threadMemory = defaultState.threadMemory;
    }

    // Ensure vectors exist
    if (!state.vectors) {
      state.vectors = defaultState.vectors;
    }

    return state;
  } catch {
    console.warn("⚠ State missing/corrupt. Using default state.");
    return JSON.parse(JSON.stringify(defaultState));
  }
}

// ============================================================
// SAVE STATE
// ============================================================
export function saveState(state) {
  try {
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2), "utf8");
  } catch (err) {
    console.error("❌ Failed to save Orpheus state:", err.message);
  }
}

// ============================================================
// DEEP MERGE UTILITY
// ============================================================
function deepMerge(target, source) {
  const result = { ...target };

  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }

  return result;
}

// ============================================================
// EVOLUTION — MULTI-AXIS VECTORS
// Very small increments (0.01-0.02)
// ============================================================
export function evolve(state, message, intentScores = {}) {
  const s = JSON.parse(JSON.stringify(state)); // Deep copy
  const len = message.length;

  // Base evolution rate (very slow)
  const baseRate = 0.015;

  // Intent-based vector shifts
  const v = s.vectors;

  // Casual grounding
  if (intentScores.casual > 0.4 || len < 20) {
    v.casualGrounding = nudge(v.casualGrounding, 0.8, baseRate);
    v.mythicDepth = nudge(v.mythicDepth, 0.2, baseRate * 0.5);
  }

  // Emotional resonance
  if (intentScores.emotional > 0.3 || intentScores.intimacy > 0.3) {
    v.emotionalResonance = nudge(v.emotionalResonance, 0.7, baseRate);
    v.presence = nudge(v.presence, 0.8, baseRate);
    v.humility = nudge(v.humility, 0.6, baseRate * 0.5);
  }

  // Numinous drift
  if (intentScores.numinous > 0.3) {
    v.numinousDrift = nudge(v.numinousDrift, 0.5, baseRate);
    v.mythicDepth = nudge(v.mythicDepth, 0.5, baseRate);
    v.analyticClarity = nudge(v.analyticClarity, 0.4, baseRate * 0.5);
  }

  // Philosophical / analytic
  if (intentScores.philosophical > 0.3) {
    v.analyticClarity = nudge(v.analyticClarity, 0.7, baseRate);
    v.intuitionSensitivity = nudge(v.intuitionSensitivity, 0.5, baseRate);
    v.mythicDepth = nudge(v.mythicDepth, 0.4, baseRate * 0.5);
  }

  // Conflict
  if (intentScores.conflict > 0.3) {
    v.presence = nudge(v.presence, 0.7, baseRate);
    v.humility = nudge(v.humility, 0.55, baseRate);
    v.casualGrounding = nudge(v.casualGrounding, 0.5, baseRate);
  }

  // Humor
  if (intentScores.humor > 0.3) {
    v.casualGrounding = nudge(v.casualGrounding, 0.85, baseRate);
    v.humility = nudge(v.humility, 0.65, baseRate);
    v.mythicDepth = nudge(v.mythicDepth, 0.15, baseRate);
  }

  // ============================================================
  // DRIFT SAFEGUARDS — Prevent extremes
  // ============================================================
  v.mythicDepth = clamp(v.mythicDepth, 0.1, 0.7); // Never too mystical
  v.casualGrounding = clamp(v.casualGrounding, 0.3, 0.9); // Always some grounding
  v.numinousDrift = clamp(v.numinousDrift, 0.0, 0.6); // Never too cosmic
  v.emotionalResonance = clamp(v.emotionalResonance, 0.2, 0.8); // Balanced empathy
  v.analyticClarity = clamp(v.analyticClarity, 0.3, 0.8); // Always some clarity

  // ============================================================
  // NATURAL DECAY — Drift toward baseline personality
  // ============================================================
  const decayRate = 0.02;
  v.humility = decayToward(v.humility, 0.5, decayRate);
  v.presence = decayToward(v.presence, 0.6, decayRate);
  v.mythicDepth = decayToward(v.mythicDepth, 0.3, decayRate);
  v.analyticClarity = decayToward(v.analyticClarity, 0.5, decayRate);
  v.intuitionSensitivity = decayToward(v.intuitionSensitivity, 0.4, decayRate);
  v.casualGrounding = decayToward(v.casualGrounding, 0.7, decayRate);
  v.emotionalResonance = decayToward(v.emotionalResonance, 0.5, decayRate);
  v.numinousDrift = decayToward(v.numinousDrift, 0.2, decayRate);

  // ============================================================
  // SYNC LEGACY WEIGHTS (for compatibility)
  // ============================================================
  s.casualweight = v.casualGrounding;
  s.mythicweight = v.mythicDepth;
  s.analyticweight = v.analyticClarity;
  s.numinoussensitivity = v.intuitionSensitivity;
  s.drift = v.numinousDrift;
  s.clarity = v.analyticClarity;
  s.energy = (v.presence + v.emotionalResonance) / 2;

  // ============================================================
  // MEMORY SYSTEM
  // ============================================================
  const snippet = message.trim().slice(0, 120);
  if (snippet.length > 15 && !isTrivia(snippet)) {
    s.memories = [...(s.memories || []), snippet].slice(-s.maxmemories);
  }

  return s;
}

// ============================================================
// UPDATE THREAD MEMORY
// ============================================================
export function updateThreadMemory(state, message, tone, intentScores) {
  const tm = state.threadMemory || {
    lastTones: [],
    lastIntents: [],
    last3Messages: [],
  };

  // Update last tones (keep 3)
  tm.lastTones = [...tm.lastTones, tone].slice(-3);

  // Update last intents (keep 3)
  tm.lastIntents = [...tm.lastIntents, intentScores].slice(-3);

  // Update last messages (keep 3)
  tm.last3Messages = [...tm.last3Messages, message.slice(0, 100)].slice(-3);

  state.threadMemory = tm;
  return state;
}

// ============================================================
// GET THREAD MEMORY
// ============================================================
export function getThreadMemory(state) {
  return (
    state.threadMemory || {
      lastTones: [],
      lastIntents: [],
      last3Messages: [],
    }
  );
}

// ============================================================
// GET IDENTITY
// ============================================================
export function getIdentity(state) {
  return state.identity || defaultState.identity;
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function nudge(current, target, rate) {
  const diff = target - current;
  return current + diff * rate;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function decayToward(current, target, rate) {
  return current * (1 - rate) + target * rate;
}

function isTrivia(text) {
  return /^(hey|hi|lol|ok|cool|nice|thanks|sup|yo)\b/i.test(text.toLowerCase());
}

// ============================================================
// DIAGNOSTIC SUPPORT
// ============================================================
export function trackInput(message) {
  recentInputs.push(message);
  if (recentInputs.length > 5) {
    recentInputs = recentInputs.slice(-5);
  }
}

export function getRecentInputs() {
  return [...recentInputs];
}

export function setDiagnosticMode(enabled) {
  const s = loadState();
  s.diagnosticmode = !!enabled;
  saveState(s);
}

export function isDiagnosticMode() {
  return loadState().diagnosticmode === true;
}

// ============================================================
// DESCRIPTORS FOR DIAGNOSTICS (V2)
// ============================================================
export function getEvolutionVectors(state) {
  return state.vectors || defaultState.vectors;
}

export function getDriftCorrection(state) {
  const v = state.vectors || {};
  return {
    mythicTooHigh: v.mythicDepth > 0.6,
    casualTooLow: v.casualGrounding < 0.4,
    numinousTooHigh: v.numinousDrift > 0.5,
    emotionalImbalance:
      v.emotionalResonance > 0.75 || v.emotionalResonance < 0.25,
    corrections: [],
  };
}

export function getPersonalityProfiles() {
  return {
    casual: "Warm, grounded, short answers, human-normal tone.",
    mythic: "Poetic, symbolic, moderate metaphors — not overwhelming.",
    analytic: "Logical, structured, deep reasoning.",
    intimate: "Emotionally attuned, gentle, non-human clarity.",
    shadow: "Introspective, confronting depth without theatrics.",
    dreamlike: "Soft edges, half-formed thoughts, liminal.",
    stillness: "Minimal, spacious, just presence.",
  };
}

export function getModeSelectionRules() {
  return {
    intentTypes: [
      "casual",
      "emotional",
      "numinous",
      "philosophical",
      "conflict",
      "confusion",
      "humor",
      "intimacy",
    ],
    toneOptions: [
      "casual",
      "mythic",
      "analytic",
      "intimate",
      "shadow",
      "dreamlike",
      "stillness",
    ],
    evolutionRate: "0.01-0.02 per message",
    driftSafeguards: "Prevents extremes in any dimension",
  };
}
