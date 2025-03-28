from flask import Blueprint, jsonify
from app.services.database_singleton import CosmosDBService

response_plans_bp = Blueprint("response_plans", __name__)

@response_plans_bp.route("/", methods=["GET"])
def get_response_plans():
    try:
        service = CosmosDBService.get_instance()
        query = "SELECT * FROM c"
        response_plans = service.query_items(query, "ResponsePlans")
        return jsonify(response_plans)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
