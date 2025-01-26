const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Endpoint for text-to-speech
app.post("/text-to-speech", (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).send("Text is required");
  }

  // Execute the TTS Python script
  exec(`python "${__dirname}/tts.py" "${text}"`, (error) => {
    if (error) {
      console.error("Error executing TTS:", error);
      return res.status(500).send("Failed to generate audio");
    }

    // Confirm the audio file creation
    const audioPath = path.join(__dirname, "output.mp3");
    fs.access(audioPath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error("Audio file not found:", err);
        return res.status(404).send("Audio file not found");
      }
      res.status(200).send("Audio file generated successfully");
    });
  });
});

// Endpoint to fetch the generated audio
app.get("/get-audio", (req, res) => {
  const audioPath = path.join(__dirname, "output.mp3");

  // Ensure the audio file exists before sending
  fs.access(audioPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("Audio file not found:", err);
      return res.status(404).send("Audio file not found");
    }

    // Send the audio file
    res.sendFile(audioPath, (err) => {
      if (err) {
        console.error("Error sending audio file:", err);
        res.status(500).send("Error sending audio file");
      }
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});