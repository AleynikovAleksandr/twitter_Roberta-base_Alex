from flask import Blueprint, request, jsonify, flash, render_template
import emoji
import re
from .SentimentPredictor import SentimentPredictor
from langdetect import detect, DetectorFactory
from langdetect.lang_detect_exception import LangDetectException


api = Blueprint('api', __name__)

# Главная страница
@api.route("/")
def index():
    return render_template("auth_interface.html")


# Инициализация модели
MODEL_PATH = "/home/alex_a/twitter_Roberta-base_Alex/bertweet_model"
predictor = SentimentPredictor(MODEL_PATH)

# Проверка на английский текст через langdetect
def is_english(text):
    try:
        # Предобработка твита через SentimentPredictor
        cleaned_text = predictor.preprocess_tweet(text)
        return detect(cleaned_text) == 'en'
    except LangDetectException:
        return False

# Ограничение длины твита
MAX_LENGTH = 280

# API для проверки текста (JS будет вызывать эту функцию вместо локальной проверки)
@api.route("/api/check_english", methods=["POST"])
def check_english():
    data = request.json
    text = data.get("text", "")
    valid = is_english(text)
    if valid:
        return jsonify({"valid": True})
    else:
        return jsonify({"valid": False, "error": "Only English text is allowed"})

@api.route("/api/predict", methods=["POST"])
def predict():
    data = request.json
    text = data.get("text", "")

    if len(text) > MAX_LENGTH:
        return jsonify({"error": f"Text too long. Max {MAX_LENGTH} characters allowed."}), 400

    if not is_english(text):
        return jsonify({"error": "Only English text is allowed"}), 400

    result = predictor.predict(text)
    return jsonify(result)
