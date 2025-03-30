import strategies.resource_requirements as resource_requirements
from strategies.allocation_strategy import AllocationStrategy

class HazmatStrategy(AllocationStrategy):
    def __init__(self):
        self.hazmat_resources = resource_requirements['HAZMAT']

    def allocate(self, resources, severity):
        required = self.hazmat_resources.get(severity, {})
        self.check_resource_availability(required, resources)
        return self.allocate_resources()
