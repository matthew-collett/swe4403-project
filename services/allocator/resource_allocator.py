import datetime
import os

base_url = os.getenv("API_BASE_URL")
class ResourceAllocator:
    def __init__(self, resource_client, incident_client, incident_factory, strategy_factory, mqtt_handler):
        self.resource_client = resource_client
        self.incident_client = incident_client
        self.incident_factory = incident_factory
        self.strategy_factory = strategy_factory
        self.mqtt_handler = mqtt_handler
    
    def allocate_new_incident(self, incident_id):
        incident_data = self.incident_client.get_incident(incident_id)
        print(incident_data)
        incident = self.incident_factory.create_incident(incident_data)

        incident_type = incident.type.upper()
        strategy = self.strategy_factory.create_strategy(incident_type)

        if not strategy:
            print(f"No strategy found for {incident_type}, skipping.")
            return
        
        resources = self.resource_client.get_unassigned_resources()

        allocated = strategy.allocate(resources, incident.severity, self.resource_client)

        if not allocated:
            print(f"Failed to allocate resources for incident {incident.id}")
            return self.mqtt_handler.publish_message(
                topic=f"incidents/{incident.id}/status",
                payload={
                    "id": incident.id,
                    "status": "PENDING",
                    "updated_at": datetime.utcnow().isoformat() + "Z"
                },
            )
        
        self.allocate_status_update(incident.id, "ACTIVE")
        
    def allocate_status_update(self, incident_id, status):
        if status == "RESOLVED":
            self.resource_client.free_resources(incident_id)
        else:
            self.incident_client.update_status(incident_id, status)

        return self.mqtt_handler.publish_message(
            topic=f"incidents/{incident_id}/status",
            payload={
                "id": incident_id,
                "status": status,
                "updated_at": datetime.utcnow().isoformat() + "Z"
            }
        )

