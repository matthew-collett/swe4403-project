from flask import Blueprint, request, jsonify
from app.services.database_singleton import CosmosDBService
from app.middlewares.auth import token_required

responses_bp = Blueprint("responses", __name__)


@responses_bp.route("", methods=["GET"])
@token_required
def get_responses():
    try:
        service = CosmosDBService.get_instance()
        query = "SELECT * FROM c"
        responses = service.query_items(query, "Responses")
        return jsonify(responses)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@responses_bp.route("<id>", methods=["GET"])
@token_required
def get_response_by_id(id):
    try:
        service = CosmosDBService.get_instance()
        responses = service.read_item(id, "id", "Responses")

        if not responses:
            return jsonify({"message": "Response not found"}), 404

        return jsonify(responses)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@responses_bp.route("", methods=["POST"])
@token_required
def create_response():
    try:
        service = CosmosDBService.get_instance()
        new_response = service.add_item(request.json, "Responses")
        return jsonify(new_response), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@responses_bp.route("<id>", methods=["PUT"])
@token_required
def update_response(id):
    try:
        service = CosmosDBService.get_instance()
        updated_response = service.update_item(id, request.json, "Responses")
        return jsonify(updated_response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@responses_bp.route("<id>", methods=["DELETE"])
@token_required
def delete_response(id):
    try:
        service = CosmosDBService.get_instance()
        service.delete_item(id, id, "Responses")
        return jsonify({"message": "Response deleted"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
