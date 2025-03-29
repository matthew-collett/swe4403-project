import os
import requests

class ResourceClient:
    def __init__(self, auth_manager, base_url=None):
        self.base_url = base_url or os.getenv("API_BASE_URL")
        self.auth_manager = auth_manager
    
    def _headers(self):
        return {
            "Authorization": f"Bearer {self.auth_manager.get_id_token()}",
            "Content-Type": "application/json"
        }

    def allocate_resources(self, incident_id, resources):
        url = f"{self.base_url}/resources/allocate"
        payload = {
            "incidentId": incident_id,
            "resourceIds": resources
        }
        response = requests.post(url, json=payload, timeout=10)
        response.raise_for_status()
        return response.json()
