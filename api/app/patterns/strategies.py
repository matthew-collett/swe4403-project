class ResourceAllocationStrategy:
    def allocate_resources(self, incident):
        raise NotImplementedError("Subclasses must implement allocate_resources")


class FireIncidentStrategy(ResourceAllocationStrategy):
    def allocate_resources(self, incident):
        return {"resources": ["Fire Truck", "Support Team"]}


class MedicalIncidentStrategy(ResourceAllocationStrategy):
    def allocate_resources(self, incident):
        return {"resources": ["Ambulance", "Medical Team"]}


class PoliceIncidentStrategy(ResourceAllocationStrategy):
    def allocate_resources(self, incident):
        return {"resources": ["Police Car", "SWAT Unit"]}


class ResourceAllocator:
    STRATEGIES = {
        "FIRE": FireIncidentStrategy(),
        "MEDICAL": MedicalIncidentStrategy(),
        "POLICE": PoliceIncidentStrategy()
    }

    @staticmethod
    def allocate(incident_type, incident):
        strategy = ResourceAllocator.STRATEGIES.get(incident_type, None)
        if strategy:
            return strategy.allocate_resources(incident)
        return {"resources": ["General Support Team"]}