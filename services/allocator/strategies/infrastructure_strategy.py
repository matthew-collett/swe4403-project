import strategies.resource_requirements as resource_requirements
from strategies.allocation_strategy import AllocationStrategy

class InfrastructureStrategy(AllocationStrategy):
    def __init__(self):
        self.infrastructure_resources = resource_requirements['INFRASTRUCTURE']

    def allocate(self, resources, severity):
        required = self.infrastructure_resources.get(severity, {})
        self.check_resource_availability(required, resources)
        return self.allocate_resources()
