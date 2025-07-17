require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_PROJECT_ID) {
    console.error("❌ Missing API key or project ID.");
    return res.status(500).json({ error: "Server misconfigured." });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are Carl, an AI NPC in a Roblox game." },
          { role: "user", content: userMessage }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'OpenAI-Project': process.env.OPENAI_PROJECT_ID,
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error("🛑 OpenAI API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "OpenAI request failed" });
  }
});

app.get('/', (req, res) => {
  res.send("Carl's brain is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Carl is listening on port ${PORT}`);
});
