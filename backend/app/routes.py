from flask import Blueprint, request, jsonify, render_template
import requests

api = Blueprint("api", __name__)

MODEL_SERVER_URL = "http://model_server:2000"

@api.route("/")
def index():
    return render_template("auth_interface.html")

@api.route("/api/check_english", methods=["POST"])
def check_english():
    data = request.json
    response = requests.post(f"{MODEL_SERVER_URL}/check_english", json=data)
    return jsonify(response.json()), response.status_code

@api.route("/api/predict", methods=["POST"])
def predict_proxy():
    data = request.json
    response = requests.post(f"{MODEL_SERVER_URL}/predict", json=data)
    return jsonify(response.json()), response.status_code
