const Constants = {
  IncidentType: {
    FIRE: 'Fire',
    MEDICAL: 'Medical',
    POLICE: 'Police',
    OTHER: 'Other',
  },
  Severity: {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    CRITICAL: 'Critical',
  },
  Status: {
    OPEN: 'Open',
    CLOSED: 'Closed',
    PENDING: 'Pending',
    RESOLVED: 'Resolved',
  },
  ResourceType: {
    AMBULANCE: 'Ambulance',
    FIRE_TRUCK: 'Fire Truck',
    POLICE_CAR: 'Police Car',
    UTILITY_VEHICLE: 'Utility Vehicle',
  },
  ResourceCategory: {
    EMERGENCY: 'Emergency',
    NON_EMERGENCY: 'Non-Emergency',
    SUPPORT: 'Support',
    ADMINISTRATIVE: 'Administrative',
  },
}

module.exports = Constants
