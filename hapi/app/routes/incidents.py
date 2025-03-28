from flask import Blueprint, request, jsonify
from app.services.database_singleton import CosmosDBService

incidents_bp = Blueprint("incidents", __name__)

@incidents_bp.route("/", methods=["GET"])
def get_incidents():
    try:
        service = CosmosDBService.get_instance()
        query = "SELECT * FROM c"
        incidents = service.query_items(query, "Incidents")

        return jsonify(incidents)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
