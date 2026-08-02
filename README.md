#  SignBridge AI

**AI-powered real-time sign language translator**

SignBridge AI is a web application that uses Artificial Intelligence and Computer Vision to translate sign language gestures into text and speech in real time. The project aims to reduce communication barriers between hearing-impaired individuals and the general public.

Built for the **SDG 9 Innovation Hackathon**.

##  Features

* Real-time hand detection
* Live gesture recognition
* Text translation
* Text-to-speech output
* Conversation history
* Modern and responsive dashboard

##  Tech Stack

**Frontend**

* React.js
* Tailwind CSS
* JavaScript

**Backend**

* FastAPI
* Python

**AI & Computer Vision**

* OpenCV
* MediaPipe
* TensorFlow/Keras

**Database**

* SQLite

##  Supported Gestures

* Hello
* Thank You
* Yes
* No
* Help
* Stop
* Please
* Water
* I love you
* Okay
* Good
* Peace

##  Workflow

Camera → OpenCV → MediaPipe → AI Model → Text → Speech


##  SDG Alignment

* SDG 9: Industry, Innovation and Infrastructure
* SDG 10: Reduced Inequalities

##  Run Locally

git clone <repository-url>

cd signspeak-connect
npm install
npm run dev

cd backend
pip install -r requirements.txt
uvicorn main:app --reload

##  Future Scope

* Indian Sign Language support
* Multilingual translation
* Offline mode
* Mobile deployment
* AI-powered conversation assistant
