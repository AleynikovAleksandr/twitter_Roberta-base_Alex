import os
from flask import Flask
from flask_cors import CORS

def create_app():
    # Абсолютный путь к frontend/templates
    template_dir = "/home/alex_a/twitter_Roberta-base_Alex/frontend/templates"
    static_dir = "/home/alex_a/twitter_Roberta-base_Alex/frontend/static"

    app = Flask(__name__,
                template_folder=template_dir,
                static_folder=static_dir)

    CORS(app)

    from .routes import api
    app.register_blueprint(api, url_prefix="/")

    return app
