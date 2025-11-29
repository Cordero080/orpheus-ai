// ------------------------------------------------------------
// ORPHEUS V2 — FUSION ENGINE (CLEAN FIXED VERSION)
// ------------------------------------------------------------

import {
  loadState,
  saveState,
  evolve,
  trackInput,
  updateThreadMemory,
  getThreadMemory,
  getIdentity,
  getRecentInputs,
  getEvolutionVectors,
  getDriftCorrection,
  getPersonalityProfiles,
  getModeSelectionRules,
  setDiagnosticMode,
  isDiagnosticMode,
} from "./state.js";

import { generate, detectIntent } from "./responseEngine.js";

import {
  applyUpgrades,
  parseUpgradeInstructions,
  wantsUpgrade,
} from "./upgrade.js";

// ------------------------------------------------------------
// DIAGNOSTICS COMMANDS
// ------------------------------------------------------------

function wantsEnterDiagnostics(msg) {
  const m = msg.toLowerCase().trim();
  return (
    /^orpheus,?\s*enter diagnostics?/.test(m) ||
    /^diagnostics?$/.test(m) ||
    /^orpheus,?\s*diagnostics?$/.test(m)
  );
}

function wantsExitDiagnostics(msg) {
  const m = msg.toLowerCase().trim();
  return /^orpheus,?\s*(exit|leave|end)\s+diagnostics?/.test(m);
}

// ------------------------------------------------------------
// DIAGNOSTICS JSON OUTPUT (NO TALKING)
// ------------------------------------------------------------

function generateDiagnosticOutput(state, tone, intentScores) {
  const diagnosticData = {
    evolutionVectors: getEvolutionVectors(state),
    weights: {
      casual: state.casualweight,
      mythic: state.mythicweight,
      analytic: state.analyticweight,
      numinousSensitivity: state.numinoussensitivity,
      drift: state.drift,
    },
    lastIntent: intentScores,
    lastTone: tone,
    threadMemory: getThreadMemory(state),
    identity: getIdentity(state),
    driftCorrection: getDriftCorrection(state),
    memory: {
      stored: state.memories || [],
      count: (state.memories || []).length,
      max: state.maxmemories || 10,
    },
    recentInputs: getRecentInputs(),
    profiles: getPersonalityProfiles(),
    rules: getModeSelectionRules(),
  };

  return "```json\n" + JSON.stringify(diagnosticData, null, 2) + "\n```";
}

// ------------------------------------------------------------
// MAIN — orpheusRespond()
// ------------------------------------------------------------

export function orpheusRespond(userMessage) {
  // Track
  trackInput(userMessage);

  // Load
  let state = loadState();

  // ------------------------------------------------------------
  // DIAGNOSTIC MODE
  // ------------------------------------------------------------

  if (wantsEnterDiagnostics(userMessage)) {
    setDiagnosticMode(true);
    const updated = loadState();
    return {
      reply: generateDiagnosticOutput(updated, "diagnostic", {}),
      monologue: "",
      mode: "diagnostic",
    };
  }

  if (wantsExitDiagnostics(userMessage)) {
    setDiagnosticMode(false);
    return {
      reply: "Diagnostic mode disabled. Returning to normal operation.",
      monologue: "",
      mode: "casual",
    };
  }

  if (isDiagnosticMode()) {
    const intents = detectIntent(userMessage);
    return {
      reply: generateDiagnosticOutput(state, "diagnostic", intents),
      monologue: "",
      mode: "diagnostic",
    };
  }

  // ------------------------------------------------------------
  // UPGRADE HANDLING
  // ------------------------------------------------------------

  if (wantsUpgrade(userMessage)) {
    const upgrades = parseUpgradeInstructions(userMessage);
    if (Object.keys(upgrades).length > 0) {
      const success = applyUpgrades(upgrades, state);
      if (success) {
        return {
          reply: "Upgrades accepted.",
          monologue: "",
          mode: "upgrade",
        };
      }
    }
  }

  // ------------------------------------------------------------
  // NORMAL CINEMATIC FLOW
  // ------------------------------------------------------------

  const threadMemory = getThreadMemory(state);
  const identity = getIdentity(state);

  const intentScores = detectIntent(userMessage);

  // Generate cinematic response
  const { reply, tone } = generate(
    userMessage,
    state,
    threadMemory,
    identity
  );

  // ------------------------------------------------------------
  // FIXED: Proper evolution call
  // ------------------------------------------------------------

  const humanityLevel = state.humanitylevel || state.humanityLevel || 0.8;
  state = evolve(state, userMessage, humanityLevel);

  // Update thread memory
  state = updateThreadMemory(state, userMessage, tone, intentScores);

  // Save
  saveState(state);

  // Return final
  return {
    reply: String(reply),
    monologue: "",
    mode: tone,
  };
}
