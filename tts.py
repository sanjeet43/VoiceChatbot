import pyttsx3
import sys
import os

def text_to_speech(text):
  engine = pyttsx3.init()
  output_file = os.path.join(os.path.dirname(__file__), "uploads", "response.mp3")
  engine.save_to_file(text, output_file)
  engine.runAndWait()

if __name__ == "__main__":
  if len(sys.argv) > 1:
    text_to_speech(sys.argv[1])
  else:
    print("No text provided")