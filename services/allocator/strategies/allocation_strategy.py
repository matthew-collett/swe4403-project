from abc import ABC, abstractmethod

class AllocationStrategy(ABC):
    @abstractmethod
    def allocate(self, incident, inventory):
        pass

    def check_resource_availability(required, resources):
        pass

    def allocate_resources(resources):
        pass