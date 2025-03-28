from flask import Flask
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())


def create_app():
    app = Flask(__name__)

    from app.routes.incidents import incidents_bp
    from app.routes.resources import resources_bp
    from app.routes.response_plans import response_plans_bp
    from app.routes.responses import responses_bp
    app.register_blueprint(incidents_bp, url_prefix='/incidents')
    app.register_blueprint(resources_bp, url_prefix='/resources')
    app.register_blueprint(response_plans_bp, url_prefix='/response_plans')
    app.register_blueprint(responses_bp, url_prefix='/responses')

    return app
