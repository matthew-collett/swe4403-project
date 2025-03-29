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
 
def allocate_new_incident(incident_data):
    print("Handling new incident:", incident_data)
    
    
def allocate_status_update(status_data):
    print("Handling status update:", status_data)
    # Your logic for reacting to incident status changes

