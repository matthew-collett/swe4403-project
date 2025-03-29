from mqtt_handler import build_client
from api_clients.resource_client import ResourceClient
from api_clients.incidents_client import IncidentClient
from auth.firebase_auth import FirebaseAuthManager

def main():
    auth_manager = FirebaseAuthManager(service_uid="allocator")
    resource_client = ResourceClient(auth_manager)
    incident_client = IncidentClient(auth_manager)

    client = build_client()
    client.loop_forever()

if __name__ == '__main__':
    main()
