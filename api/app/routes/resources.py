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


@resources_bp.route("/notAssigned", methods=["GET"])
@token_required
def get_unassigned_resources():
    try:
        service = CosmosDBService.get_instance()
        query = "SELECT * FROM c WHERE c.isAllocated = false"
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


@resources_bp.route("/allocate", methods=["PUT"])
@token_required
def allocate_resources():
    try:
        data = request.json
        resource_ids = data.get("resource_ids")
        incident_id = data.get("incident_id")

        service = CosmosDBService.get_instance()

        for resource_id in resource_ids:
            resource = service.read_item(resource_id, resource_id, "Resources")

            resource["isAllocated"] = True
            resource["incidentId"] = incident_id

            service.update_item(resource_id, resource, "Resources")

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@resources_bp.route("/free", methods=["PUT"])
@token_required
def free_resources():
    try:
        data = request.json
        incident_id = data.get("incident_id")

        service = CosmosDBService.get_instance()
        resources = service.list_items("incidentId", incident_id, "Resources")
        for resource in resources:
            resource["isAllocated"] = False
            service.update_item(resource["id"], resource, "Resources")

    except Exception as e:
        return jsonify({"error": str(e)}), 500
