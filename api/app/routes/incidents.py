from flask import Blueprint, request, jsonify
from app.services.database_singleton import CosmosDBService
from app.middlewares.auth import token_required

incidents_bp = Blueprint("incidents", __name__)


@incidents_bp.route("", methods=["GET"])
@token_required
def get_incidents():
    try:
        service = CosmosDBService.get_instance()
        query = "SELECT * FROM c"
        incidents = service.query_items(query, "Incidents")
        return jsonify(incidents)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@incidents_bp.route("<string:id>", methods=["GET"])
@token_required
def get_incident_by_id(id):
    try:
        service = CosmosDBService.get_instance()
        incident = service.read_item(id, id, "Incidents")
        if not incident:
            return jsonify({"message": "Incident not found"}), 404
        return jsonify(incident)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@incidents_bp.route("status", methods=["GET"])
@token_required
def get_incidents_by_status():
    try:
        status = request.args.get('status')
        if not status:
            return jsonify({"error": "Status query parameter is required"}), 400

        status = status.upper()

        service = CosmosDBService.get_instance()
        incidents = service.list_items("status", status, "Incidents")

        if not incidents:
            return jsonify({"message": f"No incidents found with status: {status}"}), 404

        return jsonify(incidents)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@incidents_bp.route("<string:id>", methods=["PUT"])
@token_required
def update_incident(id):
    try:
        # Get the update data from the request
        update_data = request.json

        if not update_data:
            return jsonify({"error": "No update data provided"}), 400

        service = CosmosDBService.get_instance()

        # Get the current incident
        incident = service.read_item(id, id, "Incidents")

        # Apply the updates from request.json to the incident
        for key, value in update_data.items():
            incident[key] = value

        # Update the incident in the database
        updated_incident = service.update_item(id, incident, "Incidents")

        return jsonify(updated_incident)
    except Exception as e:
        print(f"Error updating incident {id}: {str(e)}")
        return jsonify({"error": str(e)}), 500


@incidents_bp.route("<string:id>", methods=["DELETE"])
@token_required
def delete_incident(id):
    try:
        service = CosmosDBService.get_instance()
        service.delete_item(id, id, "Incidents")
        return jsonify({"message": "Incident deleted"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@incidents_bp.route("", methods=["POST"])
@token_required
def create_incident():
    try:
        data = request.json
        service = CosmosDBService.get_instance()
        new_incident = service.add_item(data, "Incidents")
        return jsonify(new_incident), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
