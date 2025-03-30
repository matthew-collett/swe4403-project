from abc import ABC, abstractmethod

class AllocationStrategy(ABC):
    @abstractmethod
    def allocate(self, resources, severity, resource_client):
        pass

    @staticmethod
    def check_resource_availability(required, resources):
        resource_ids = {}
        for resource in resources:
            type = resource.get("type")
            if type:
                resource_ids.setdefault(type, []).append(resource.get("id"))

        allocation = {}

        for resource_type, qty_needed in required.items():
            available = resource_ids.get(resource_type, [])
            if len(available) < qty_needed:
                return None

            allocation[resource_type] = [id for id in available[:qty_needed]]

        return allocation
    