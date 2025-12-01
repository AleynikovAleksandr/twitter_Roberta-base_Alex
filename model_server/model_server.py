from flask import Flask, request, jsonify
from SentimentPredictor import SentimentPredictor
from langdetect import detect
from langdetect.lang_detect_exception import LangDetectException

app = Flask(__name__)

MODEL_PATH = "/app/model_server/models/bertweet_model"
predictor = SentimentPredictor(MODEL_PATH)

MAX_LENGTH = 280

def is_english(text):
    try:
        cleaned_text = predictor.preprocess_tweet(text)
        return detect(cleaned_text) == "en"
    except LangDetectException:
        return False



@app.route("/check_english", methods=["POST"])
def check_english():
    text = request.json.get("text", "")
    if not is_english(text):
        return jsonify({"valid": False, "error": "Only English allowed"}), 400
    return jsonify({"valid": True})

@app.route("/predict", methods=["POST"])
def predict():
    text = request.json.get("text", "")
    if len(text) > MAX_LENGTH:
        return jsonify({"error": f"Max length {MAX_LENGTH} chars"}), 400
    if not is_english(text):
        return jsonify({"error": "Only English text allowed"}), 400
    result = predictor.predict(text)
    return jsonify(result)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=2000, debug=True)
