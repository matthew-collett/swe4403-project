import os
import json
import certifi
import paho.mqtt.client as mqtt

class MQTTHandler:
    def __init__(self, resource_allocator):
        self.resource_allocator = resource_allocator
        self.BROKER_HOST = os.getenv('MQTT_BROKER_HOST')
        self.BROKER_PORT = int(os.getenv('MQTT_BROKER_PORT'))
        self.MQTT_USERNAME = os.getenv('MQTT_USERNAME')
        self.MQTT_PASSWORD = os.getenv('MQTT_PASSWORD')

    def on_connect(self, client, userdata, flags, rc, props):
        if rc == 0:
            client.subscribe("incidents/new")
            client.subscribe("incidents/+/status")
            print("Connected to HiveMQ")
        else:
            print(f"MQTT connection failed with code {rc}")

    def on_message(self, client, userdata, msg):
        try:
            topic = msg.topic
            payload = json.loads(msg.payload.decode("utf-8"))
            print(f"Message received on {topic}: {payload}")

            if topic == "incidents/new":
                self.resource_allocator.allocate_new_incident(payload)
            elif topic.startswith("incidents/") and topic.endswith("/status"):
                self.resource_allocator.allocate_status_update(payload)
            else:
                print(f"Ignored message on topic: {topic}")
        except Exception as e:
            print(f"Error handling message: {e}")

    def build_client(self):
        client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
        client.username_pw_set(self.MQTT_USERNAME, self.MQTT_PASSWORD)
        client.tls_set(ca_certs=certifi.where())
        client.on_connect = self.on_connect
        client.on_message = self.on_message
        client.connect(self.BROKER_HOST, self.BROKER_PORT, 60)
        print("Connecting to HiveMQ")
        return client
