class IncidentFactory:
    @staticmethod
    def create_incident(data):
        return Incident(
            incident_id=data.get('id'),
            incident_type=data.get('type'),
            severity=data.get('severity'),
            location=data.get('location'),
            description=data.get('description'),
            reported_at=data.get('reportedAt'),
            reported_by=data.get('reportedBy')
        )

class Incident:
    def __init__(self, incident_id, incident_type, severity, location, description,
                 reported_at, reported_by):
        self.id = incident_id
        self.type = incident_type
        self.severity = severity
        self.location = location
        self.description = description
        self.reported_at = reported_at
        self.reported_by = reported_by
