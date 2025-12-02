// ============================================================
// ORPHEUS — TOKEN USAGE TRACKER
// Purpose: Track API token usage and warn before budget exhaustion
// ============================================================

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "../../data");
const USAGE_FILE = path.join(DATA_DIR, "token_usage.json");

// Default monthly budget in tokens (configurable)
const DEFAULT_MONTHLY_BUDGET = 10_000_000; // ~10M tokens = ~$30-40/month with Sonnet

// Warning thresholds (percentage of budget remaining)
const WARNING_THRESHOLDS = {
  critical: 0.05, // 5% remaining — urgent warning
  low: 0.15, // 15% remaining — warning
  notice: 0.3, // 30% remaining — heads up
};

/**
 * Load current usage data
 */
function loadUsage() {
  try {
    if (fs.existsSync(USAGE_FILE)) {
      const data = JSON.parse(fs.readFileSync(USAGE_FILE, "utf-8"));

      // Reset if new month
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}`;

      if (data.month !== currentMonth) {
        console.log(`[TokenTracker] New month detected. Resetting usage.`);
        return createFreshUsage(currentMonth);
      }

      return data;
    }
  } catch (error) {
    console.error("[TokenTracker] Error loading usage:", error.message);
  }

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;
  return createFreshUsage(currentMonth);
}

/**
 * Create fresh usage object for a new month
 */
function createFreshUsage(month) {
  return {
    month,
    budget: DEFAULT_MONTHLY_BUDGET,
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    messageCount: 0,
    lastUpdated: new Date().toISOString(),
    warnings: [],
  };
}

/**
 * Save usage data
 */
function saveUsage(usage) {
  try {
    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    usage.lastUpdated = new Date().toISOString();
    fs.writeFileSync(USAGE_FILE, JSON.stringify(usage, null, 2));
  } catch (error) {
    console.error("[TokenTracker] Error saving usage:", error.message);
  }
}

/**
 * Record token usage from an API call
 * @param {number} inputTokens - Tokens used for input (prompt)
 * @param {number} outputTokens - Tokens used for output (response)
 * @returns {object} - { recorded: boolean, warning: string|null, usage: object }
 */
export function recordUsage(inputTokens, outputTokens) {
  const usage = loadUsage();

  usage.inputTokens += inputTokens;
  usage.outputTokens += outputTokens;
  usage.totalTokens += inputTokens + outputTokens;
  usage.messageCount += 1;

  saveUsage(usage);

  const warning = checkWarning(usage);

  if (warning) {
    console.log(`[TokenTracker] ⚠️ ${warning.level}: ${warning.message}`);
  }

  console.log(
    `[TokenTracker] Usage: ${usage.totalTokens.toLocaleString()}/${usage.budget.toLocaleString()} tokens (${getPercentUsed(
      usage
    )}%)`
  );

  return {
    recorded: true,
    warning,
    usage: getUsageSummary(usage),
  };
}

/**
 * Check if we should warn the user
 */
function checkWarning(usage) {
  const remaining = usage.budget - usage.totalTokens;
  const percentRemaining = remaining / usage.budget;

  if (percentRemaining <= WARNING_THRESHOLDS.critical) {
    return {
      level: "critical",
      message: `Only ${Math.round(
        percentRemaining * 100
      )}% of your monthly token budget remains. You have approximately ${estimateMessagesRemaining(
        remaining
      )} messages left.`,
      inject: true,
    };
  }

  if (percentRemaining <= WARNING_THRESHOLDS.low) {
    return {
      level: "low",
      message: `${Math.round(
        percentRemaining * 100
      )}% of your monthly token budget remains (~${estimateMessagesRemaining(
        remaining
      )} messages).`,
      inject: true,
    };
  }

  if (percentRemaining <= WARNING_THRESHOLDS.notice) {
    return {
      level: "notice",
      message: `Heads up: ${Math.round(
        percentRemaining * 100
      )}% of your monthly budget remains.`,
      inject: false, // Don't inject into response, just log
    };
  }

  return null;
}

/**
 * Estimate how many messages remain based on average usage
 */
function estimateMessagesRemaining(tokensRemaining) {
  const usage = loadUsage();

  if (usage.messageCount === 0) {
    // Assume ~28k tokens per message (system prompt + response)
    return Math.floor(tokensRemaining / 28000);
  }

  const avgTokensPerMessage = usage.totalTokens / usage.messageCount;
  return Math.floor(tokensRemaining / avgTokensPerMessage);
}

/**
 * Get percentage of budget used
 */
function getPercentUsed(usage) {
  return Math.round((usage.totalTokens / usage.budget) * 100);
}

/**
 * Get a summary of current usage
 */
function getUsageSummary(usage) {
  if (!usage) usage = loadUsage();

  const remaining = usage.budget - usage.totalTokens;

  return {
    month: usage.month,
    used: usage.totalTokens,
    budget: usage.budget,
    remaining,
    percentUsed: getPercentUsed(usage),
    messageCount: usage.messageCount,
    messagesRemaining: estimateMessagesRemaining(remaining),
    avgTokensPerMessage:
      usage.messageCount > 0
        ? Math.round(usage.totalTokens / usage.messageCount)
        : null,
  };
}

/**
 * Get current usage (for external queries)
 */
export function getCurrentUsage() {
  return getUsageSummary();
}

/**
 * Set monthly budget
 */
export function setBudget(tokens) {
  const usage = loadUsage();
  usage.budget = tokens;
  saveUsage(usage);
  console.log(`[TokenTracker] Budget set to ${tokens.toLocaleString()} tokens`);
  return getUsageSummary(usage);
}

/**
 * Format a warning message for Orpheus to speak
 */
export function formatWarningForOrpheus(warning) {
  if (!warning || !warning.inject) return null;

  if (warning.level === "critical") {
    return `\n\n---\n⚠️ *Heads up — ${warning.message} You might want to pace yourself or we'll go quiet until next month.*`;
  }

  if (warning.level === "low") {
    return `\n\n---\n📊 *Quick note: ${warning.message} Just keeping you in the loop.*`;
  }

  return null;
}

export default {
  recordUsage,
  getCurrentUsage,
  setBudget,
  formatWarningForOrpheus,
};
