const recordButton = document.getElementById("record-button");
const transcriptDisplay = document.getElementById("transcript");
const audioOutput = document.getElementById("audio-output");

let recognition;

if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";

  recordButton.addEventListener("click", () => {
    transcriptDisplay.textContent = "Listening...";
    recognition.start();
  });

  recognition.onresult = async (event) => {
    const text = event.results[0][0].transcript;
    transcriptDisplay.textContent = `You said: "${text}"`;

    try {
      const response = await fetch("http://localhost:3000/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const data = await response.json();
        audioOutput.src = `http://localhost:3000${data.audioFile}?timestamp=${new Date().getTime()}`;
        audioOutput.load();
        audioOutput.play();
      } else {
        alert("Error generating audio");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    transcriptDisplay.textContent = `Error: ${event.error}`;
  };
} else {
  alert("Speech recognition is not supported in your browser. Please use Chrome.");
}