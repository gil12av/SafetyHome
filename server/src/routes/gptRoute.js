// 📁 server/src/routes/gptRoute.js
const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const GptMessage  = require("../models/GptMessage");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const defaultPromptContext =
  "Please respond in no more than 3 sentences. Use English. The response must be relevant to smart home security, device vulnerabilities, or CVEs. If the topic is irrelevant, kindly ask the user to ask something related.";

router.get("/history", async (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json({ error: "Not authenticated" });

  const messages = await GptMessage.find({ user: user._id }).sort({ createdAt: 1 });
  res.json(messages);
});

router.post("/ask", async (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json({ error: "Not authenticated" });

  const { prompt } = req.body;
  console.log("🤖 Received GPT prompt:", prompt);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: defaultPromptContext },
        { role: "user", content: prompt },
      ],
      max_tokens: 250,
      temperature: 0.7,
    });

    const answer = completion.choices[0].message.content;
    console.log("✅ GPT Answer:", answer);

    // Save both user question + bot answer
    await GptMessage.create([
      { user: user._id, sender: "user", content: prompt },
      { user: user._id, sender: "bot", content: answer },
    ]);

    res.json(answer);
  } catch (err) {
    console.error("❌ GPT Error:", err.message || err);
    res.status(500).json({ error: "GPT failed" });
  }
});

module.exports = router;
