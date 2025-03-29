class IncidentFactory:
    @staticmethod
    def create_incident(data):
        required_fields = ["type", "severity", "status", "description"]
        
        for field in required_fields:
            if field not in data:
                raise ValueError(f"Missing required field: {field}")

        return {
            "id": data.get("id"),
            "type": data["type"],
            "severity": data["severity"],
            "status": data["status"],
            "description": data["description"],
            "timestamp": data.get("timestamp")
        }