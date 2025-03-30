import strategies.resource_requirements as resource_requirements
from strategies.allocation_strategy import AllocationStrategy

class HazmatStrategy(AllocationStrategy):
    def __init__(self):
        self.hazmat_resources = resource_requirements['HAZMAT']

    def allocate(self, resources, severity, resource_client):
        required = self.hazmat_resources.get(severity, {})
        resources_to_allocate = self.check_resource_availability(required, resources)
        if resources_to_allocate is None:
            return None
        return resource_client.allocate_resources(resources_to_allocate)
