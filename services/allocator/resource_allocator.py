import os
import requests
from factories.strategy_factory import StrategyFactory
from factories.incident_factory import IncidentFactory

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
    incident = IncidentFactory.create_incident(incident_data)

    incident_type = incident_data['type'].upper()
    strategy = StrategyFactory.create_strategy(incident_type)

    if not strategy:
        print(f"No strategy found for {incident_type}, skipping.")
        return

    allocated = strategy.allocate(incident_data)

    # send message to frontend
    
    
def allocate_status_update(status_data):

    print("Handling status update:", status_data)

