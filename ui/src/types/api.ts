/* eslint-disable no-unused-vars */
export type Incident = {
  id: string
  type: IncidentType
  severity: SeverityType
  status: StatusType
  address: string
  description: string
  reportedAt: Date
  lastUpdatedAt: Date
}

export enum IncidentType {
  FIRE = 'Fire',
  MEDICAL = 'Medical',
  INFRASTRUCTURE = 'Infrastructure',
  HAZMAT = 'Hazmat',
  NATURAL_DISASTER = 'Natural Disaster',
}

export enum SeverityType {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

export enum StatusType {
  OPEN = 'Open',
  CLOSED = 'Closed',
  PENDING = 'Pending',
  RESOLVED = 'Resolved',
}

export enum ResourceType {
  AMBULANCE = 'Ambulance',
  FIRE_TRUCK = 'Fire Truck',
  POLICE_CAR = 'Police Car',
  UTILITY_VEHICLE = 'Utility Vehicle',
}

export enum ResourceCategory {
  EMERGENCY = 'Emergency',
  NON_EMERGENCY = 'Non-Emergency',
  SUPPORT = 'Support',
  ADMINISTRATIVE = 'Administrative',
}
