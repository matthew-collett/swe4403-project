import os
import requests

ALLOCATION_ENDPOINT = os.getenv("ALLOCATION_ENDPOINT")

def allocate_resources(incident_data):
    try:
        print("Allocating resources for incident:", incident_data)
        response = requests.post(ALLOCATION_ENDPOINT, json=incident_data, timeout=10)
        if response.status_code == 200:
            print("Allocation successful:", response.json())
        else:
            print(f"Allocation failed: {response.status_code} {response.text}")
    except Exception as e:
        print(f"Error during allocation: {e}")
 