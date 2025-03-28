from flask import Flask
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())
import os


def create_app():
    app = Flask(__name__)

    from app.routes.incidents import incidents_bp
    app.register_blueprint(incidents_bp, url_prefix='/incidents')

    return app
