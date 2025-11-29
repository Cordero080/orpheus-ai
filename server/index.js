// ------------------------- IMPORTS ---------------------------------
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { orpheusRespond } from "./orpheus/fusion.js";
// ^ Your Orpheus fusion engine

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

  const { reply, monologue, mode } = orpheusRespond(message);

  // Map mode to engine for frontend visualization
  const modeToEngine = {
    casual: null,
    oracular: "archetype",
    analytic: "reflection",
    intimate: "memory",
    shadow: "synthesis",
    diagnostic: "reflection",
    upgrade: "synthesis",
  };

  // Return reply + engine state for UI
  res.json({
    reply,
    engine: modeToEngine[mode] || null,
    mode,
  });
});

// -------------------------- START SERVER ----------------------------
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
