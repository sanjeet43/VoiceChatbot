const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post("/text-to-speech", (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).send("Text is required");
  }

  exec(`python "${__dirname}/tts.py" "${text}"`, (error) => {
    if (error) {
      console.error("Error executing TTS:", error);
      return res.status(500).send("Failed to generate audio");
    }

    res.send({ audioFile: '/uploads/response.mp3' });
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});