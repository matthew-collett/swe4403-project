from abc import ABC, abstractmethod

class AllocationStrategy(ABC):
    @abstractmethod
    def allocate(self, incident, inventory):
        pass