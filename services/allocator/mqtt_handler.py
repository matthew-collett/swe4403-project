import os
import json
import certifi
import paho.mqtt.client as mqtt
from resource_allocator import allocate_resources

BROKER_HOST = os.getenv('MQTT_BROKER_HOST')
BROKER_PORT = int(os.getenv('MQTT_BROKER_PORT'))
MQTT_TOPIC = os.getenv('MQTT_TOPIC')
MQTT_USERNAME = os.getenv('MQTT_USERNAME')
MQTT_PASSWORD = os.getenv('MQTT_PASSWORD')

def on_connect(client, userdata, flags, rc, props):
    if rc == 0:
        print("Connected to HiveMQ")
        client.subscribe(MQTT_TOPIC)
    else:
        print(f"MQTT connection failed with code {rc}")

def on_message(client, userdata, msg):
    try:
        payload = msg.payload.decode("utf-8")
        print(f"Received: {payload}")
        incident_data = json.loads(payload)
        allocate_resources(incident_data)
    except Exception as e:
        print(f"Message handling error: {e}")

def build_client():
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
    client.tls_set(ca_certs=certifi.where())
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(BROKER_HOST, BROKER_PORT, 60)
    print("Connecting to HiveMQ")
    return client
