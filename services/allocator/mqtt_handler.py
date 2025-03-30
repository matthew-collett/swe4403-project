import os
import json
import certifi
import paho.mqtt.client as mqtt
from resource_allocator import ResourceAllocator

class MQTTHandler:
    def __init__(self, resource_allocator):
        self.resource_allocator = resource_allocator
        self.BROKER_HOST = os.getenv('MQTT_BROKER_HOST')
        self.BROKER_PORT = int(os.getenv('MQTT_BROKER_PORT'))
        self.MQTT_USERNAME = os.getenv('MQTT_USERNAME')
        self.MQTT_PASSWORD = os.getenv('MQTT_PASSWORD')
        self.client = None

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
                incident_id = payload.get("id")
                self.resource_allocator.allocate_new_incident(incident_id)
            elif topic.startswith("incidents/") and topic.endswith("/status"):
                incident_id = payload.get("id")
                status = payload.get("status")
                self.resource_allocator.allocate_status_update(incident_id, status)
            else:
                print(f"Ignored message on topic: {topic}")
        except Exception as e:
            print(f"Error handling message: {e}")

    def publish_message(self, topic, payload, qos=1):
        if self.client is None:
            raise RuntimeError("MQTT client not initialized.")

        payload_str = json.dumps(payload)
        result = self.client.publish(topic, payload=payload_str, qos=qos)
        status = result.rc

        if status == mqtt.MQTT_ERR_SUCCESS:
            print(f"Message published to {topic}")
        else:
            print(f"Failed to publish message to {topic}, error code: {status}")

    def build_client(self):
        self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
        self.client.username_pw_set(self.MQTT_USERNAME, self.MQTT_PASSWORD)
        self.client.tls_set(ca_certs=certifi.where())
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.connect(self.BROKER_HOST, self.BROKER_PORT, 60)
        print("Connecting to HiveMQ")
        return self.client
