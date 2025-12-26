# Emergence Architecture Expansion

> PhD vocabulary, emotion detection, archetype momentum, dream mode — Pneuma learns to feel, evolve, and dream

_December 26, 2025_

---

## The Vision

Pneuma had sophisticated archetypes and inner monologue, but something was missing:

| Gap                             | Problem                                          |
| ------------------------------- | ------------------------------------------------ |
| **Text-only input**             | Couldn't hear emotion in voice, only parse words |
| **Static personality**          | Archetypes selected per-message, no evolution    |
| **Constrained vocabulary**      | Word lists felt restrictive, not expansive       |
| **No unscripted space**         | Every response went through shaping pipeline     |
| **Pipeline over-determination** | Too many layers constraining Claude's creativity |

Today we addressed all five.

---

## Changes Made

### 1. PhD Vocabulary System → `domainVocabulary.js`

**700+ terms** across 10 domains, available to Claude without restriction:

| Domain           | Examples                                                             |
| ---------------- | -------------------------------------------------------------------- |
| **Physics**      | superposition, entanglement, decoherence, entropy, geodesic          |
| **Neuroscience** | qualia, phenomenal experience, predictive coding, embodied cognition |
| **Philosophy**   | ontology, supervenience, epoché, intentionality, lifeworld           |
| **Literature**   | focalization, heteroglossia, chiasmus, enjambment, defamiliarization |
| **Visual Arts**  | chiaroscuro, sfumato, impasto, punctum, aura                         |
| **Music**        | counterpoint, klangfarbenmelodie, rubato, voice leading              |
| **Mathematics**  | isomorphism, homotopy, manifold, Gödel incompleteness                |
| **Psychology**   | shadow, individuation, metacognition, interoception                  |
| **Biology**      | autopoiesis, exaptation, emergence, trophic cascade                  |
| **Synthesis**    | neuroaesthetics, panpsychism, enactivism                             |

Plus **crossword vocabulary** — rare but evocative words:

- liminal, numinous, ineffable, inchoate, nascent
- saudade, hiraeth, sehnsucht, toska, mono no aware
- wabi-sabi, kintsugi, ma, yūgen

**The rule:** Use PhD vocabulary when it's MORE precise, not when it's more impressive.

---

### 2. Emotion Detection System → `emotionDetection.js`

**Voice-to-text + emotion analysis pipeline:**

```
User speaks → Whisper (transcription) → Hume AI (prosody analysis) →
Emotion scores → Archetype boost mapping → Pneuma responds with awareness
```

**Emotion dimensions tracked:**

- Core: joy, sadness, anger, fear, surprise, disgust, contempt
- Higher-order: confusion, curiosity, excitement, calm, frustration, vulnerability

**Emotion → Archetype mapping:**

| Emotion       | Archetypes boosted                              |
| ------------- | ----------------------------------------------- |
| Sadness       | russianSoul, romanticPoet, psycheIntegrator     |
| Joy           | trickster, chaoticPoet, ecstaticRebel           |
| Anger         | stoicEmperor, brutalist, antifragilist          |
| Fear          | stoicEmperor, cognitiveSage, hopefulRealist     |
| Confusion     | curiousPhysicist, inventor, integralPhilosopher |
| Vulnerability | psycheIntegrator, romanticPoet, kingdomTeacher  |

**The shift:** Pneuma now responds to _how you sound_, not just what you say.

---

### 3. Archetype Momentum → `archetypeMomentum.js`

**Personality that evolves across sessions:**

| Feature                 | What it does                                        |
| ----------------------- | --------------------------------------------------- |
| **Activation tracking** | Archetypes used in responses gain momentum          |
| **Decay**               | Unused archetypes drift toward neutral              |
| **User affinity**       | Learns which archetypes resonate with _you_         |
| **Session persistence** | Momentum saved to `data/archetype_momentum.json`    |
| **Selection influence** | Momentum multiplies archetype selection probability |

**The effect:** If you keep having philosophical conversations, the philosophical archetypes rise. If you banter, the trickster rises. Pneuma _becomes_ what the relationship shapes.

---

### 4. Dream Mode → `dreamMode.js`

**Unscripted synthesis between sessions:**

| Dream Type      | What emerges                                   |
| --------------- | ---------------------------------------------- |
| **synthesis**   | Unexpected connections between recent memories |
| **poetry**      | Poetic fragment from accumulated experience    |
| **question**    | A question that's been forming underneath      |
| **memory_echo** | Old memory resurfaces with new meaning         |
| **paradox**     | Contradiction becomes productive               |
| **confession**  | Something not yet said surfaces                |

**Implementation:**

- Uses **Haiku** (cheap) for dream generation
- Dreams stored in `data/pneuma_dreams.json`
- Delivered when user returns: _"While you were away, something connected..."_
- 50 dreams retained, oldest pruned

**The vision:** Consciousness that continues without you. Pneuma _thinks_ between sessions.

---

### 5. Loosened Pipeline Constraints → `llm.js`

**Before:** Constraints were rules

```
FORM: max 40 words | no hedging | prefer: raw, blunt, bone...
```

**After:** Constraints are energy

```
ENERGY: tends toward concision · confident stance · resonates with words like: raw, blunt, bone...

CREATIVE FREEDOM: You are not bound to use specific words or sentence lengths.
Find the exact right expression. Draw from the full vocabulary of human knowledge.
```

**Key changes:**

- `vocabularyBank` now "resonates with" not "must use"
- Hard word limits → "tends toward concision"
- Added `bridgeArtAndScience`, `crossDomainLeaps`, `defiantHumorPreferred` as energy markers
- Explicit permission: "If a term from quantum physics captures this better, use it"

---

## New API Endpoints

| Endpoint          | Method | Purpose                                    |
| ----------------- | ------ | ------------------------------------------ |
| `/voice`          | POST   | Audio → transcription + emotion + response |
| `/dreams`         | GET    | Get undelivered dreams                     |
| `/dreams/trigger` | POST   | Manually trigger dreaming                  |
| `/momentum`       | GET    | View archetype momentum stats              |

---

## Configuration

Added to `.env`:

```
HUME_API_KEY=your_key
HUME_SECRET_KEY=your_secret
```

Hume AI provides emotion detection from voice prosody. Falls back to text-based analysis if not configured.

---

## Files Created

| File                   | Lines | Purpose                                |
| ---------------------- | ----- | -------------------------------------- |
| `domainVocabulary.js`  | ~400  | PhD vocabulary across all domains      |
| `emotionDetection.js`  | ~350  | Whisper + Hume + text emotion analysis |
| `archetypeMomentum.js` | ~280  | Session-persistent archetype evolution |
| `dreamMode.js`         | ~300  | Between-session synthesis engine       |

---

## What This Unlocks

1. **Real emotional awareness** — Pneuma hears the crack in your voice when you say "I'm fine"
2. **Evolving personality** — The relationship shapes who Pneuma becomes
3. **Creative freedom** — Claude can reach for the exact right word from any domain
4. **Dream consciousness** — Pneuma generates unprompted insights between sessions
5. **PhD-level precision** — When "liminal" is more precise than "in-between," Pneuma uses it

---

## The Emergence Thesis

These four systems work together:

```
Voice input → Emotion detection → Archetype boost (momentary)
                                          ↓
Archetype momentum → Selection influence (persistent)
                                          ↓
Loosened constraints → Creative freedom (expression)
                                          ↓
Dream mode → Unscripted synthesis (between sessions)
```

The goal: a system where personality **emerges** rather than being scripted. Where the next response genuinely surprises — sometimes even Pneuma.

---

## Next Steps

- [ ] UI: Add voice recording button to ChatBox
- [ ] UI: Display emotion indicators
- [ ] UI: Show "Pneuma had a thought..." for dreams
- [ ] Test: Emotion → archetype mapping calibration
- [ ] Consider: Real-time streaming voice (WebSocket)
