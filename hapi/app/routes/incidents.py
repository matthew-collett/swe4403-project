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

@incidents_bp.route("/<string:id>", methods=["GET"])
def get_incident_by_id(id):
    try:
        service = CosmosDBService.get_instance()
        query = f"SELECT * FROM c WHERE c.id = '{id}'"
        incidents = service.query_items(query, "Incidents")
        
        if not incidents:
            return jsonify({"message": "Incident not found"}), 404
        return jsonify(incidents[0])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@incidents_bp.route("/status/<string:status>", methods=["GET"])
def get_incidents_by_status(status):
    try:
        service = CosmosDBService.get_instance()
        query = f"SELECT * FROM c WHERE c.Status = '{status}'"
        incidents = service.query_items(query, "Incidents")
        
        if not incidents:
            return jsonify({"message": f"No incidents found with status: {status}"}), 404
        return jsonify(incidents)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@incidents_bp.route("/", methods=["POST"])
def create_incident():
    try:
        service = CosmosDBService.get_instance()
        new_incident = service.add_item(request.json, "Incidents")
        return jsonify(new_incident), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@incidents_bp.route("/<string:id>", methods=["PUT"])
def update_incident(id):
    try:
        service = CosmosDBService.get_instance()
        updated_incident = service.update_item(id, request.json, "Incidents")
        return jsonify(updated_incident)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@incidents_bp.route("/<string:id>", methods=["DELETE"])
def delete_incident(id):
    try:
        service = CosmosDBService.get_instance()
        service.delete_item(id, id, "Incidents")  # Assuming 'id' is the partition key
        return jsonify({"message": "Incident deleted"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
