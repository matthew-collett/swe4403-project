from abc import ABC, abstractmethod
from strategies.resource_requirements import resource_requirements


class AllocationStrategy(ABC):
    """Base allocation strategy that contains common logic for all strategies"""

    def __init__(self, incident_type):
        """Initialize with the specific incident type resources"""
        self.required_resources = resource_requirements.get(incident_type, {})

    def allocate(self, resources, severity):
        """
        Allocate resources based on incident severity

        Args:
            resources: List of available resources
            severity: Severity level of the incident

        Returns:
            List of resource IDs to allocate, or None if allocation is not possible
        """
        required = self.required_resources.get(severity.upper(), {})
        resources_to_allocate = self.check_resource_availability(
            required, resources)

        if not resources_to_allocate:
            return None

        # Extract resource IDs into a flat list for the API call
        all_resource_ids = []
        for resource_ids in resources_to_allocate.values():
            all_resource_ids.extend(resource_ids)


        return all_resource_ids

    @staticmethod
    def check_resource_availability(required, resources):
        """
        Check if the required resources are available

        Args:
            required: Dictionary of resource types and quantities needed
            resources: List of available resources

        Returns:
            Dictionary of resource types and their IDs to allocate, or None if unavailable
        """
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
