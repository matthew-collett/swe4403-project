from api_clients.resource_client import ResourceClient
from api_clients.incidents_client import IncidentClient
from auth.firebase_auth import FirebaseAuthManager
from factories.incident_factory import IncidentFactory
from factories.strategy_factory import StrategyFactory
from resource_allocator import ResourceAllocator
from mqtt_handler import MQTTHandler

def main():
    auth_manager = FirebaseAuthManager(service_uid="allocator")

    resource_client = ResourceClient(auth_manager)
    incident_client = IncidentClient(auth_manager)

    incident_factory = IncidentFactory()
    strategy_factory = StrategyFactory()

    resource_allocator = ResourceAllocator(resource_client, incident_client, incident_factory, strategy_factory)

    resource_allocator.allocate_new_incident({"type": "fire", "severity": "HIGH"})

    mqtt_handler = MQTTHandler(resource_allocator)
    client = mqtt_handler.build_client()
    client.loop_forever()

if __name__ == '__main__':
    main()
