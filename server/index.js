// ------------------------- IMPORTS ---------------------------------
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { synthesizeResponse } from "./orpheus/synthesisEngine.js";
// ^ Your Orpheus synthesis engine

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

  const reply = synthesizeResponse(message);

  res.json({ reply });
});

// -------------------------- START SERVER ----------------------------
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
