import os
import requests


class IncidentClient:
    def __init__(self, auth_manager, base_url=None):
        self.base_url = base_url or os.getenv("API_BASE_URL")
        self.auth_manager = auth_manager

    def _headers(self):
        return {
            "Authorization": f"Bearer {self.auth_manager.get_id_token()}",
            "Content-Type": "application/json"
        }

    def create_incident(self, incident_data):
        url = f"{self.base_url}/incidents"
        response = requests.post(
            url, headers=self._headers(), json=incident_data, timeout=10)
        response.raise_for_status()
        return response

    def update_status(self, incident_id, status):
        url = f"{self.base_url}/incidents/{incident_id}"
        payload = {"status": status}
        response = requests.put(
            url, headers=self._headers(), json=payload, timeout=10)
        response.raise_for_status()
        return response.json()

    def update_stillpending(self, incident_id, stillpending):
        url = f"{self.base_url}/incidents/{incident_id}"
        payload = {"stillPending": stillpending}
        response = requests.put(
            url, headers=self._headers(), json=payload, timeout=10)
        response.raise_for_status()
        return response.json()

    def get_incident(self, incident_id):
        url = f"{self.base_url}/incidents/{incident_id}"
        response = requests.get(url, headers=self._headers(), timeout=10)
        response.raise_for_status()
        return response.json()
