import os
import json
import certifi
import paho.mqtt.client as mqtt
from resource_allocator import allocate_new_incident, allocate_status_update

BROKER_HOST = os.getenv('MQTT_BROKER_HOST')
BROKER_PORT = int(os.getenv('MQTT_BROKER_PORT'))
MQTT_USERNAME = os.getenv('MQTT_USERNAME')
MQTT_PASSWORD = os.getenv('MQTT_PASSWORD')

def on_connect(client, userdata, flags, rc, props):
    if rc == 0:
        client.subscribe("incidents/new")
        client.subscribe("incidents/+/status")
        print("Connected to HiveMQ")
    else:
        print(f"MQTT connection failed with code {rc}")

def on_message(client, userdata, msg):
    try:
        topic = msg.topic
        payload = json.loads(msg.payload.decode("utf-8"))
        print(f"Message received on {topic}: {payload}")

        if topic == "incidents/new":
            allocate_new_incident(payload)
        elif topic.startswith("incidents/") and topic.endswith("/status"):
            allocate_status_update(payload)
        else:
            print(f"Ignored message on topic: {topic}")
    except Exception as e:
        print(f"Error handling message: {e}")

def build_client():
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
    client.tls_set(ca_certs=certifi.where())
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(BROKER_HOST, BROKER_PORT, 60)
    print("Connecting to HiveMQ")
    return client
