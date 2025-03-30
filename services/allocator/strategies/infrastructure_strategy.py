import strategies.resource_requirements as resource_requirements
from strategies.allocation_strategy import AllocationStrategy

class InfrastructureStrategy(AllocationStrategy):
    def __init__(self):
        self.infrastructure_resources = resource_requirements['INFRASTRUCTURE']

    def allocate(self, resources, severity, resource_client):
        required = self.infrastructure_resources.get(severity, {})
        resources_to_allocate = self.check_resource_availability(required, resources)
        if resources_to_allocate is None:
            return None
        return resource_client.allocate_resources(resources_to_allocate)
