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
    data = request.json
    resource_ids = data.get("resource_ids")
    incident_id = data.get("incident_id")

    if not resource_ids or not incident_id:
        return jsonify({"error": "Missing required parameters"}), 400

    service = CosmosDBService.get_instance()
    successful_updates = []
    failed_updates = []

    for resource_id in resource_ids:
        try:
            resource = service.read_item(resource_id, resource_id, "Resources")
            resource["isAllocated"] = True
            resource["incidentId"] = incident_id
            service.update_item(resource_id, resource, "Resources")
            successful_updates.append(resource_id)
        except Exception as e:
            print(f"Error updating resource {resource_id}: {str(e)}")
            failed_updates.append({"id": resource_id, "error": str(e)})

    if failed_updates:
        return jsonify({
            "partial_success": True,
            "successful_updates": successful_updates,
            "failed_updates": failed_updates
        }), 207  # 207 Multi-Status

    return jsonify({"success": True, "updated_resources": successful_updates})


@resources_bp.route("/free", methods=["PUT"])
@token_required
def free_resources():
    data = request.json
    incident_id = data.get("incident_id")

    if not incident_id:
        return jsonify({"error": "Missing incident_id parameter"}), 400

    service = CosmosDBService.get_instance()

    try:
        resources = service.list_items("incidentId", incident_id, "Resources")
        print(resources)

        if not resources:
            return jsonify({"message": "No resources found for this incident"}), 200

        successful_updates = []
        failed_updates = []

        for resource in resources:
            try:
                resource["isAllocated"] = False
                resource["incidentId"] = None
                service.update_item(resource["id"], resource, "Resources")
                successful_updates.append(resource["id"])
            except Exception as e:
                print(f"Error freeing resource {resource['id']}: {str(e)}")
                failed_updates.append({"id": resource["id"], "error": str(e)})

        if failed_updates:
            return jsonify({
                "partial_success": True,
                "message": f"Successfully freed {len(successful_updates)} resources, {len(failed_updates)} failed",
                "successful_updates": successful_updates,
                "failed_updates": failed_updates
            }), 207  # 207 Multi-Status

        return jsonify({
            "success": True,
            "message": f"Successfully freed {len(successful_updates)} resources",
            "freed_resources": successful_updates
        })
    except Exception as e:
        print(f"Error in free_resources: {str(e)}")
        return jsonify({"error": str(e)}), 500
