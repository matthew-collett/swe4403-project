from flask import Blueprint, request, jsonify
from app.services.database_singleton import CosmosDBService
from app.middlewares.auth import token_required
from app.factories.incident_factory import IncidentFactory
from app.services.resource_allocator import ResourceAllocator

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
        incidents = service.read_item(id, "id", "Incidents")
        if not incidents:
            return jsonify({"message": "Incident not found"}), 404
        return jsonify(incidents)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@incidents_bp.route("/status", methods=["GET"])
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

<<<<<<< Updated upstream

@incidents_bp.route("", methods=["POST"])
@token_required
def create_incident():
    try:
        service = CosmosDBService.get_instance()
        new_incident = service.add_item(request.json, "Incidents")
        return jsonify(new_incident), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


=======
>>>>>>> Stashed changes
@incidents_bp.route("<string:id>", methods=["PUT"])
@token_required
def update_incident(id):
    try:
        service = CosmosDBService.get_instance()
        updated_incident = service.update_item(id, request.json, "Incidents")
        return jsonify(updated_incident)
    except Exception as e:
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
        incident = IncidentFactory.create_incident(data)

        allocated_resources = ResourceAllocator.allocate(incident["type"], incident)
        incident["resources"] = allocated_resources["resources"]

        service = CosmosDBService.get_instance()
        new_incident = service.add_item(incident, "Incidents")
        return jsonify(new_incident), 201
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500