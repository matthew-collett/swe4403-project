import strategies.resource_requirements as resource_requirements
from strategies.allocation_strategy import AllocationStrategy

class FireStrategy(AllocationStrategy):
    def __init__(self):
        self.fire_resources = resource_requirements['FIRE']

    def allocate(self, resources, severity, resource_client):
        required = self.fire_resources.get(severity, {})
        resources_to_allocate = self.check_resource_availability(required, resources)
        if not resources_to_allocate:
            return None
        return resource_client.allocate_resources(resources_to_allocate)
    
