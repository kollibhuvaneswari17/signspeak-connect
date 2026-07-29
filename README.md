# SignSpeak Connect

Build an AI-Based Real-Time Sign Language Translator (Hackathon Project)

Project Title

SignBridge AI – Real-Time Sign Language Translator

Project Goal

Build a modern web application that uses Artificial Intelligence, Computer Vision, and Deep Learning to translate sign language into text and speech in real time. The application should help bridge the communication gap between hearing-impaired individuals and the general public. This project is being developed for an SDG 9 Innovation Hackathon, so the focus should be on innovation, accessibility, scalability, and an impressive working prototype.

Tech Stack

Frontend

React.js

Tailwind CSS

JavaScript

Backend

Python

FastAPI

AI & Computer Vision

OpenCV

MediaPipe Hands

TensorFlow/Keras (or a pre-trained gesture recognition model)

Speech

pyttsx3 (offline Text-to-Speech)

Database

SQLite (store conversation history)

Functional Requirements

1. Home Page

Create a clean, modern, responsive landing page.

Sections should include:

Hero section

About the project

SDG 9 objective

Features

Technology used

"Start Translation" button

Use a professional UI with smooth animations.

2. Live Camera Page

The application should:

Open the user's webcam.

Display live video.

Detect hands using MediaPipe.

Draw hand landmarks.

Continuously process frames.

3. Gesture Recognition

The AI model should:

Recognize supported sign language gestures.

Display the detected alphabet or word.

Update the prediction in real time.

Initially support:

Hello

Thank You

Yes

No

Help

Stop

Please

Water

The architecture should be modular so more signs can be added later.

4. Translation Panel

Display:

Current Sign

Recognized Text

Confidence Score

Recognition Status

Example:

Current Gesture:
HELLO

Confidence:
97%

Status:
Recognized Successfully

5. Text-to-Speech

Whenever a gesture is recognized:

Convert text into speech.

Speak automatically.

Include a mute/unmute button.

6. Conversation History

Maintain history including:

Time

Gesture

Generated Text

Allow users to:

Clear history

Download history (optional)

Store locally using SQLite.

7. Dashboard

Include statistics such as:

Total gestures detected

Today's translations

Accuracy percentage

Total communication sessions

Display cards and simple charts if possible.

8. Settings

Allow users to:

Enable or disable speech

Change language (UI)

Toggle dark/light mode

Adjust camera resolution

User Interface Requirements

Design a modern dashboard with:

Responsive layout

Dark mode

Gradient theme

Rounded cards

Smooth animations

Icons

Clean typography

The interface should resemble a professional SaaS AI application.

Backend APIs

Create FastAPI endpoints:

POST /start-camera

POST /stop-camera

POST /predict

POST /speak

GET /history

GET /stats

Folder Structure

Create the following project structure:

SignBridge-AI/

frontend/

src/

components/

pages/

backend/

main.py

camera.py

predict.py

speech.py

database.py

models/

gesture_model.keras

dataset/

README.md

AI Workflow

Camera

↓

OpenCV

↓

MediaPipe Hands

↓

Extract Hand Landmarks

↓

TensorFlow Model

↓

Recognized Gesture

↓

FastAPI

↓

React Frontend

↓

Display Text

↓

Text-to-Speech

↓

Save History

Future Enhancements

Design the architecture so it can later support:

Indian Sign Language (ISL)

Multiple regional sign languages

Multilingual translation (English, Hindi, Telugu)

AI Agent for grammar correction

AI Agent for contextual conversation

Speech-to-Text for two-way communication

Offline AI inference

TensorFlow Lite mobile deployment

Emotion detection

Cloud synchronization

User authentication

Personalized gesture learning

SDG Alignment

Primary SDG:
SDG 9 – Industry, Innovation and Infrastructure

Secondary SDGs:

SDG 10 – Reduced Inequalities

SDG 4 – Quality Education

Code Requirements

Use clean, modular architecture.

Follow best coding practices.

Comment important functions.

Separate frontend and backend.

Make components reusable.

Use environment variables where appropriate.

Include installation instructions.

Include a README with setup and execution steps.

Ensure the application runs locally with minimal configuration.

Hackathon Focus

This is a hackathon MVP, so prioritize:

Reliable real-time hand detection.

Accurate recognition of a limited set of gestures.

Instant text translation.

Text-to-speech output.

A polished and intuitive user interface.

Clear architecture that can be extended after the hackathon.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4f8e0861-147d-44fe-9c32-47090ccdc2f5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
