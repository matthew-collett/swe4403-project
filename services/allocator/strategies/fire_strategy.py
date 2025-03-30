import strategies.resource_requirements as resource_requirements
from strategies.allocation_strategy import AllocationStrategy

class FireStrategy(AllocationStrategy):
    def __init__(self):
        self.fire_resources = resource_requirements['FIRE']

    def allocate(self, resources, severity):
        required = self.fire_resources.get(severity, {})
        self.check_resource_availability(required, resources)
        return self.allocate_resources()
