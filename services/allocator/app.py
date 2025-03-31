from api_clients.resource_client import ResourceClient
from api_clients.incidents_client import IncidentClient
from auth.firebase_auth import FirebaseAuthManager
from factories.incident_factory import IncidentFactory
from factories.strategy_factory import StrategyFactory
from resource_allocator import ResourceAllocator
from mqtt_handler import MQTTHandler


def handle_mqtt_message(topic, payload, resource_allocator):
    try:
        if topic == "incidents/new":
            incident_id = payload.get("id")
            resource_allocator.allocate_new_incident(incident_id)
        elif topic.startswith("incidents/") and topic.endswith("/status"):
            incident_id = payload.get("id")
            status = payload.get("status")
            resource_allocator.allocate_status_update(incident_id, status)
        else:
            print(f"Ignored message on topic: {topic}")
    except Exception as e:
        print(f"Error handling message: {e}")


def main():
    auth_manager = FirebaseAuthManager(service_uid="allocator")

    resource_client = ResourceClient(auth_manager)
    incident_client = IncidentClient(auth_manager)

    incident_factory = IncidentFactory()
    strategy_factory = StrategyFactory()

    # Create MQTT handler first (without resource_allocator)
    mqtt_handler = MQTTHandler(message_handler=None)

    # Pass the publish_message function to ResourceAllocator instead of the whole mqtt_handler
    def publish_message(topic, payload, qos=1):
        if mqtt_handler and mqtt_handler.client:
            mqtt_handler.publish_message(topic, payload, qos)
        else:
            print(f"Cannot publish to {topic}, MQTT handler not ready")

    # Create the resource allocator with the publish_message function
    resource_allocator = ResourceAllocator(
        resource_client,
        incident_client,
        incident_factory,
        strategy_factory,
        publish_message
    )

    # Now set up the message handler that will call the resource_allocator
    mqtt_handler.message_handler = lambda topic, payload: handle_mqtt_message(
        topic, payload, resource_allocator)

    # Build and start the client
    client = mqtt_handler.build_client()
    client.loop_forever()


if __name__ == '__main__':
    main()
