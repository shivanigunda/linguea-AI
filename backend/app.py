from flask import Flask, request, jsonify, send_from_directory, make_response  # pyright: ignore[reportMissingImports]
from flask_cors import CORS  # pyright: ignore[reportMissingModuleSource]
import psycopg2  # pyright: ignore[reportMissingModuleSource]
import uuid
import os
from datetime import datetime
from werkzeug.utils import secure_filename  # pyright: ignore[reportMissingImports]
from gtts import gTTS  # pyright: ignore[reportMissingImports]
import whisper  # pyright: ignore[reportMissingImports]
import torch  # pyright: ignore[reportMissingImports]
import Levenshtein  # pyright: ignore[reportMissingImports]

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# ---------------- CONFIG ----------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
GENERATED_FOLDER = os.path.join(BASE_DIR, "audio_generated")
USER_FOLDER = os.path.join(BASE_DIR, "audio_user")
MAX_LOCAL_FILES = 5

model = whisper.load_model("base")

for folder in [GENERATED_FOLDER, USER_FOLDER]:
    if not os.path.exists(folder):
        os.makedirs(folder)

DB_CONFIG = {
    "host": "localhost",
    "database": "admin",
    "user": "postgres",
    "password": "flash"
}

level_mapping = {
    "beginner": 1,
    "intermediate": 2,
    "advanced": 3
}

# ---------------- DATABASE ----------------

def get_connection():
    return psycopg2.connect(**DB_CONFIG)

# ---------------- HELPERS ----------------

def clean_old_files(folder):
    files = sorted(
        [os.path.join(folder, f) for f in os.listdir(folder)],
        key=os.path.getmtime
    )
    while len(files) > MAX_LOCAL_FILES:
        os.remove(files[0])
        files.pop(0)

def generate_audio(word, path):
    tts = gTTS(word, lang="en")
    tts.save(path)

# ---------------- ROUTES ----------------

@app.route("/")
def home():
    return "Backend running successfully"

# ---------------- SIGNUP ----------------

@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    # Validate required fields
    if not data or not data.get("name") or not data.get("email") or not data.get("age"):
        return jsonify({"error": "Missing required fields"}), 400

    user_uuid = str(uuid.uuid4())

    conn = get_connection()
    cur = conn.cursor()

    try:
        # Check if email already exists
        cur.execute("SELECT uuid FROM users WHERE email = %s", (data["email"],))
        existing = cur.fetchone()

        if existing:
            # Return existing uuid instead of creating duplicate
            cur.close()
            conn.close()
            return jsonify({"user_uuid": existing[0], "existing": True})

        cur.execute(
            """
            INSERT INTO users (uuid, name, email, age, created_at)
            VALUES (%s, %s, %s, %s, NOW())
            """,
            (user_uuid, data["name"], data["email"], data["age"])
        )
        conn.commit()

    except Exception as e:
        conn.rollback()
        cur.close()
        conn.close()
        print("Database error:", e)
        return jsonify({"error": "Database error during signup"}), 500

    cur.close()
    conn.close()
    return jsonify({"user_uuid": user_uuid, "existing": False})

# ---------------- LOGIN ----------------

@app.route("/login", methods=["POST"])
def login():
    """
    Login with email only (no password yet).
    Returns user info if email exists, 404 if not found.
    """
    data = request.get_json()

    if not data or not data.get("email"):
        return jsonify({"error": "Email is required"}), 400

    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            "SELECT uuid, name, email, age FROM users WHERE email = %s",
            (data["email"],)
        )
        row = cur.fetchone()

    except Exception as e:
        cur.close()
        conn.close()
        print("Database error:", e)
        return jsonify({"error": "Database error"}), 500

    cur.close()
    conn.close()

    if not row:
        return jsonify({"error": "No account found with this email"}), 404

    return jsonify({
        "user_uuid": row[0],
        "name": row[1],
        "email": row[2],
        "age": str(row[3])
    })

# ---------------- VERIFY USER (for auto-login on refresh) ----------------

@app.route("/verify-user", methods=["POST"])
def verify_user():
    """
    Called on app load when a uuid exists in localStorage.
    Verifies the uuid is still valid in the DB.
    Returns user info if valid, 404 if not.
    """
    data = request.get_json()

    if not data or not data.get("user_uuid"):
        return jsonify({"error": "user_uuid is required"}), 400

    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            "SELECT uuid, name, email, age FROM users WHERE uuid = %s",
            (data["user_uuid"],)
        )
        row = cur.fetchone()

    except Exception as e:
        cur.close()
        conn.close()
        print("Database error:", e)
        return jsonify({"error": "Database error"}), 500

    cur.close()
    conn.close()

    if not row:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "user_uuid": row[0],
        "name": row[1],
        "email": row[2],
        "age": str(row[3])
    })

# ---------------- GET WORD ----------------

@app.route("/get-word", methods=["GET"])
def get_word():
    level_name = request.args.get("level", "beginner").lower()
    language = request.args.get("language", "english").lower()
    level_id = level_mapping.get(level_name, 1)

    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT id, text FROM words WHERE level_id=%s ORDER BY RANDOM() LIMIT 1;",
        (level_id,)
    )
    row = cur.fetchone()

    if not row:
        return jsonify({"error": "No word found"}), 404

    word_id, word_text = row

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    filename = f"{word_text}_{timestamp}.mp3"
    local_path = os.path.join(GENERATED_FOLDER, filename)

    generate_audio(word_text, local_path)
    clean_old_files(GENERATED_FOLDER)

    cur.execute(
        "UPDATE words SET audio_s3_url=%s WHERE id=%s",
        (f"http://localhost:5000/audio-generated/{filename}", word_id)
    )

    conn.commit()
    cur.close()
    conn.close()

    response = make_response(jsonify({
        "word_id": word_id,
        "word": word_text,
        "audio_url": f"http://localhost:5000/audio-generated/{filename}"
    }))
    response.headers["Cache-Control"] = "no-store"
    return response

# ---------------- SERVE GENERATED AUDIO ----------------

@app.route("/audio-generated/<filename>")
def serve_generated_audio(filename):
    return send_from_directory(GENERATED_FOLDER, filename)

# ---------------- UPLOAD USER AUDIO ----------------

@app.route("/upload-audio", methods=["POST"])
def upload_audio():
    user_uuid = request.form.get("user_uuid")
    text = request.form.get("text")
    level_id = request.form.get("level_id")
    language = request.form.get("language")
    audio_file = request.files.get("audio_file")

    if not user_uuid or not audio_file:
        return jsonify({"error": "Missing parameters"}), 400

    filename = f"{user_uuid}_{datetime.now().strftime('%Y%m%d%H%M%S')}_{secure_filename(audio_file.filename)}"
    local_path = os.path.join(USER_FOLDER, filename)
    audio_file.save(local_path)
    clean_old_files(USER_FOLDER)

    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO recorded_audios (uuid, text, level_id, language, audio_s3_url, created_at)
        VALUES (%s, %s, %s, %s, %s, NOW())
        """,
        (user_uuid, text, level_id, language, local_path)
    )
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Audio uploaded", "file_path": local_path})

# ---------------- SERVE USER AUDIO ----------------

@app.route("/audio-user/<filename>")
def serve_user_audio(filename):
    return send_from_directory(USER_FOLDER, filename)

# ---------------- ANALYZE AUDIO ----------------

@app.route('/analyze', methods=['POST'])
def analyze_audio():
    audio_file = request.files['audio_file']
    expected_word = request.form.get("text")

    temp_filename = f"temp_{datetime.now().strftime('%Y%m%d%H%M%S')}.webm"
    temp_path = os.path.join(USER_FOLDER, temp_filename)
    audio_file.save(temp_path)

    result = model.transcribe(temp_path, language="en")
    spoken_text = result["text"].strip().lower()
    expected_clean = expected_word.strip().lower()

    print("EXPECTED:", expected_clean)
    print("WHISPER HEARD:", spoken_text)

    # Check if the word appears in the transcription first
    import re
    pattern = r'\b' + re.escape(expected_clean) + r'\b'
    if re.search(pattern, spoken_text):
        similarity = 1.0
    else:
        similarity = Levenshtein.ratio(spoken_text, expected_clean)

    score = int(similarity * 100)
    print("SCORE:", score)

    if score >= 90:
        feedback = "Excellent pronunciation!"
    elif score >= 75:
        feedback = "Good pronunciation."
    elif score >= 50:
        feedback = "Needs more practice."
    else:
        feedback = "Incorrect pronunciation."

    os.remove(temp_path)

    return jsonify({"score": score, "feedback": feedback})

# ---------------- RUN SERVER ----------------

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
