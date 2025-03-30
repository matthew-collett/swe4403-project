import strategies.resource_requirements as resource_requirements
from strategies.allocation_strategy import AllocationStrategy

class NaturalDisasterStrategy(AllocationStrategy):
    def __init__(self):
        self.natural_disaster_resources = resource_requirements['NATURAL_DISASTER']

    def allocate(self, resources, severity):
        required = self.natural_disaster_resources.get(severity, {})
        self.check_resource_availability(required, resources)
        return self.allocate_resources()
