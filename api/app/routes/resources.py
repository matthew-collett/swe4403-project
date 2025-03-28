from flask import Blueprint, request, jsonify
from app.services.database_singleton import CosmosDBService
from app.middlewares.auth import token_required

resources_bp = Blueprint("resources", __name__)


@resources_bp.route("", methods=["GET"])
@token_required
def get_resources():
    try:
        service = CosmosDBService.get_instance()
        query = "SELECT * FROM c"
        resources = service.query_items(query, "Resources")
        return jsonify(resources)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@resources_bp.route("", methods=["POST"])
@token_required
def create_resource():
    try:
        service = CosmosDBService.get_instance()
        new_resource = service.add_item(request.json, "Resources")
        return jsonify(new_resource), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
