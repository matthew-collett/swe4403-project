from strategies.allocation_strategy import AllocationStrategy
from strategies.resource_requirements import resource_requirements
from strategies.utils import check_and_allocation

class InfrastructureStrategy(AllocationStrategy):
    def allocate(self, incident, inventory):
        severity = incident['severity'].upper()
        required = resource_requirements['INFRASTRUCTURE'].get(severity, {})
        return check_and_allocation(required, inventory)
