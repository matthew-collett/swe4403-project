import os
import json
import certifi
import paho.mqtt.client as mqtt


class MQTTHandler:
    def __init__(self, message_handler):
        self.message_handler = message_handler
        self.BROKER_HOST = os.getenv('MQTT_BROKER_HOST')
        self.BROKER_PORT = int(os.getenv('MQTT_BROKER_PORT'))
        self.MQTT_USERNAME = os.getenv('MQTT_USERNAME')
        self.MQTT_PASSWORD = os.getenv('MQTT_PASSWORD')
        self.client = None

    def on_connect(self, client, userdata, flags, rc, props):
        if rc == 0:
            client.subscribe("incidents/new")
            client.subscribe("incidents/allocator/+/status")
            print("Connected to HiveMQ")
        else:
            print(f"MQTT connection failed with code {rc}")

    def on_message(self, client, userdata, msg):
        try:
            topic = msg.topic
            payload = json.loads(msg.payload.decode("utf-8"))
            print(f"Message received on {topic}: {payload}")

            # Call the message handler
            if self.message_handler:
                self.message_handler(topic, payload)
            else:
                print("No message handler configured")

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
            print(
                f"Failed to publish message to {topic}, error code: {status}")

    def build_client(self):
        self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
        self.client.username_pw_set(self.MQTT_USERNAME, self.MQTT_PASSWORD)
        self.client.tls_set(ca_certs=certifi.where())
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.connect(self.BROKER_HOST, self.BROKER_PORT, 60)
        print("Connecting to HiveMQ")
        return self.client
