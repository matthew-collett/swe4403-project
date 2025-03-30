import strategies.resource_requirements as resource_requirements
from strategies.allocation_strategy import AllocationStrategy

class MedicalStrategy(AllocationStrategy):
    def __init__(self):
        self.medical_resources = resource_requirements['MEDICAL']

    def allocate(self, resources, severity):
        required = self.medical_resources.get(severity, {})
        self.check_resource_availability(required, resources)
        return self.allocate_resources()
