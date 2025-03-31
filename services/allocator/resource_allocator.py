import datetime
import os

base_url = os.getenv("API_BASE_URL")


class ResourceAllocator:
    def __init__(self, resource_client, incident_client, incident_factory, strategy_factory, publish_message_fn):
        self.resource_client = resource_client
        self.incident_client = incident_client
        self.incident_factory = incident_factory
        self.strategy_factory = strategy_factory
        self.publish_message = publish_message_fn

    def allocate_new_incident(self, incident_id):
        try:
            incident_data = self.incident_client.get_incident(incident_id)
            print(f"Processing incident data: {incident_data}")
            incident = self.incident_factory.create_incident(incident_data)

            incident_type = incident.type.upper()
            strategy_class = self.strategy_factory.create_strategy(
                incident_type)

            if not strategy_class:
                print(f"No strategy found for {incident_type}, skipping.")
                return

            # Instantiate the strategy
            strategy = strategy_class()

            resources = self.resource_client.get_unassigned_resources()
            print(f"Available resources: {len(resources)}")

            # Get the resource IDs to allocate
            resource_ids = strategy.allocate(resources, incident.severity)

            if not resource_ids:
                print(
                    f"Resource allocation API call failed for incident {incident.id}")
                self.incident_client.update_stillpending(incident_id, True)
                return self.publish_message(
                    topic=f"incidents/ui/{incident.id}/status",
                    payload={
                        "id": incident.id,
                        "status": "Pending",
                        "updated_at": datetime.datetime.utcnow().isoformat() + "Z"
                    }
                )

            self.resource_client.allocate_resources(
                incident.id, resource_ids)
            self.allocate_status_update(incident.id, "Active")
        except Exception as e:
            print(f"Error in allocate_new_incident: {e}")
            return

    def allocate_status_update(self, incident_id, status):
        try:
            if status == "Resolved":
                self.resource_client.free_resources(incident_id)

            self.incident_client.update_status(incident_id, status)
            return self.publish_message(
                topic=f"incidents/ui/{incident_id}/status",
                payload={
                    "id": incident_id,
                    "status": status,
                    "updated_at": datetime.datetime.utcnow().isoformat() + "Z"
                }
            )
        except Exception as e:
            print(f"Error in allocate_status_update: {e}")
            return
