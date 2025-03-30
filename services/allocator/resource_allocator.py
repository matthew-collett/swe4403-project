import os
import requests

base_url = os.getenv("API_BASE_URL")
class ResourceAllocator:
    def __init__(self, resource_client, incident_client, incident_factory, strategy_factory):
        self.resource_client = resource_client
        self.incident_client = incident_client
        self.incident_factory = incident_factory
        self.strategy_factory = strategy_factory
    
    def allocate_new_incident(self, incident_data):
        incident = self.incident_factory.create_incident(incident_data)

        incident_type = incident.type.upper()
        strategy = self.strategy_factory.create_strategy(incident_type)

        if not strategy:
            print(f"No strategy found for {incident_type}, skipping.")
            return
        
        resources = self.resource_client.get_resources()

        allocated = strategy.allocate(incident, resources)

        # self.incident_client.create_incident(incident)

        # send message to frontend
        
        
    def allocate_status_update(self, status_data):
        print("Handling status update:", status_data)

