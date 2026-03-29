Linguea AI – Pronunciation Learning Application

Project Overview

Linguea AI is a full-stack AI-powered pronunciation learning platform that helps users improve their speaking skills through real-time feedback and audio-based validation.

Users can:

- Select language level and learning goals
- Listen to correct pronunciation
- Record their own voice
- Receive AI-based pronunciation accuracy scores

---

Tech Stack

Frontend

- React (Vite)
- TypeScript
- Tailwind CSS

Backend

- Flask (Python)

Database

- PostgreSQL

AI & Audio Processing

- Torch
- Torchaudio
- Soundfile
- OpenAI Whisper

---

System Requirements

Ensure the following are installed:

- Python (3.x)
- Node.js (v18+)
- PostgreSQL (v14+)
- FFmpeg (for audio processing)

---

Project Structure

linguea-ai/
 ├── backend/
 ├── frontend/

---

Backend Setup (Flask)

Step 1: Navigate to backend

cd backend

---

Step 3: Install Dependencies

pip install -r requirements.txt

If not available:

pip install Flask flask-cors psycopg2-binary boto3 pyttsx3 openai torch torchaudio soundfile python-dotenv gTTS openai-whisper python-levenshtein

---

Database Setup (PostgreSQL)

Step 1: Create Database

CREATE DATABASE admin;

Step 2: Connect

\c admin

Step 3: Load Schema

psql -U postgres -d admin -f schema.sql

---

Step 4: Insert Sample Data

INSERT INTO words (text, level_id) VALUES
('Cat', 1),
('Dog', 1),
('Book', 1),
('Computer', 2),
('Language', 2),
('Philosophy', 3),
('Architecture', 3);

INSERT INTO languages (id, language_name) VALUES
(1, 'English'),
(2, 'Hindi'),
(3, 'French'),
(4, 'Spanish');

INSERT INTO levels (id, name) VALUES
(1, 'beginner'),
(2, 'intermediate'),
(3, 'advanced');

---

Step 5: Environment Configuration

Update your DB config:

DB_CONFIG = {
    "host": "localhost",
    "database": "admin",
    "user": "postgres",
    "password": "YOUR_PASSWORD"
}

---

FFmpeg Setup (Required)

1. Download from:
   https://www.gyan.dev/ffmpeg/builds/

2. Extract to:

C:\ffmpeg

3. Add to PATH:

C:\ffmpeg\ffmpeg-7.0-essentials_build\bin

4. Verify:

ffmpeg -version

---

Run Backend

python app.py

Backend runs at:

http://localhost:5000

---

Frontend Setup (React)

Step 1: Navigate

cd frontend

Step 2: Install Dependencies

npm install

If needed:

npm install react react-dom typescript lucide-react tailwindcss

---

Run Frontend

npm run dev

Frontend runs at:

http://localhost:5173

---

Application Flow

1. User selects language level and learning goal
2. Frontend requests a word from backend
3. Backend fetches data from PostgreSQL
4. Reference pronunciation audio is played
5. User records pronunciation
6. Audio sent to backend
7. Backend:
   - Saves audio
   - Runs AI validation
   - Calculates similarity score
8. Score returned to frontend
9. UI displays feedback

---

Why I Built This

This project was developed to explore:

- AI-based speech evaluation
- Full-stack application architecture
- Real-time audio processing

---

 Future Improvements

- Add real-time speech recognition
- Improve UI/UX design
- Deploy to cloud (AWS / Vercel)
- Multi-language support expansion
