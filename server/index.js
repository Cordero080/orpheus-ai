// ------------------------- IMPORTS ---------------------------------
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { generateOrpheusReply } from "./orpheus/personality.js";
import { addMemoryEntry, getEmotionalDrift } from "./orpheus/memory.js";
// ^ Your Orpheus personality engine

dotenv.config(); // Activate .env BEFORE anything else

// ------------------------- APP CONFIG -------------------------------
const app = express();
const PORT = 3000;

app.use(cors()); // allow frontend → backend communication
app.use(express.json()); // parse JSON request bodies

// -------------------------- TEST ROUTE ------------------------------
// Quick test to confirm the backend is alive
app.get("/", (req, res) => {
  res.send("🐲 Pablo's AI backend is running. 🐲");
});

// -------------------------- CHAT ROUTE ------------------------------
// Accepts user message → generates Orpheus reply → returns it
app.post("/chat", (req, res) => {
  const { message } = req.body;

  // 1) Ask memory about recent emotional drift
  const emotionalDrift = getEmotionalDrift();

  // 2) Ask Orpheus for reply + vibe, passing context
  const { reply, vibe } = generateOrpheusReply(message, { emotionalDrift });

  // 3) Store this interaction in memory
  addMemoryEntry({ userMessage: message, reply, vibe });

  console.log("🔥 ORPHEUS REPLY:", reply);

  // 4) Send back only the text to the frontend
  res.json({ reply });
});

// -------------------------- START SERVER ----------------------------
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
