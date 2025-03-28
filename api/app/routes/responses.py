from flask import Blueprint, request, jsonify
from app.services.database_singleton import CosmosDBService

responses_bp = Blueprint("responses", __name__)

@responses_bp.route("/", methods=["GET"])
def get_responses():
    try:
        service = CosmosDBService.get_instance()
        query = "SELECT * FROM c"
        responses = service.query_items(query, "Responses")
        return jsonify(responses)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@responses_bp.route("/<id>", methods=["GET"])
def get_response_by_id(id):
    try:
        service = CosmosDBService.get_instance()
        query = f"SELECT * FROM c WHERE c.id = '{id}'"
        responses = service.query_items(query, "Responses")

        if not responses:
            return jsonify({"message": "Response not found"}), 404

        return jsonify(responses[0])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@responses_bp.route("/", methods=["POST"])
def create_response():
    try:
        service = CosmosDBService.get_instance()
        new_response = service.add_item(request.json, "Responses")
        return jsonify(new_response), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@responses_bp.route("/<id>", methods=["PUT"])
def update_response(id):
    try:
        service = CosmosDBService.get_instance()
        updated_response = service.update_item(id, request.json, "Responses")
        return jsonify(updated_response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@responses_bp.route("/<id>", methods=["DELETE"])
def delete_response(id):
    try:
        service = CosmosDBService.get_instance()
        service.delete_item(id, id, "Responses")
        return jsonify({"message": "Response deleted"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
