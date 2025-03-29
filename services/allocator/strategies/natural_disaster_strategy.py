from allocation_strategy import AllocationStrategy
from .utils import check_and_build_allocation
from services.allocator.strategies.resource_requirements import resource_requirements

class NaturalDisasterStrategy(AllocationStrategy):
    def allocate(self, incident, inventory):
        severity = incident['severity'].upper()
        required = resource_requirements['NATURAL_DISASTER'].get(severity, {})
        return check_and_build_allocation(required, inventory)
