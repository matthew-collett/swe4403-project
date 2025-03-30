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
  stillPending?: boolean
}

export type Resource = {
  id: string
  type: ResourceType
  category: ResourceCategory
  isAllocated: boolean
}

export type IncidentUpdate = {
  id: string
  status: StatusType
  updatedAt: string
}
export enum IncidentType {
  FIRE = 'Fire',
  HAZMAT = 'Hazmat',
  INFRASTRUCTURE = 'Infrastructure',
  MEDICAL = 'Medical',
  NATURAL_DISASTER = 'Natural Disaster',
}

export enum SeverityType {
  HIGH = 'High',
  LOW = 'Low',
  MEDIUM = 'Medium',
}

export enum StatusType {
  ACTIVE = 'Active',
  PENDING = 'Pending',
  RESOLVED = 'Resolved',
}

export enum ResourceType {
  // Vehicles
  AMBULANCE = 'Ambulance',
  BOAT = 'Boat',
  COMMAND_VEHICLE = 'Command Vehicle',
  FIRE_TRUCK = 'Fire Truck',
  HAZMAT_VEHICLE = 'Hazmat Vehicle',
  RESCUE_VEHICLE = 'Rescue Vehicle',
  UTILITY_TRUCK = 'Utility Truck',
  WATER_TANKER = 'Water Tanker',

  // Personnel
  EMT = 'EMT',
  FIREFIGHTER = 'Firefighter',
  HAZMAT_TECH = 'Hazmat Tech',
  RESCUE_PERSONNEL = 'Rescue Personnel',
  TECHNICIAN = 'Technician',

  // Unit
  DECONTAMINATION_UNIT = 'Decontamination Unit',
  ENGINEERING_UNIT = 'Engineering Unit',
  HEAVY_EQUIPMENT = 'Heavy Equipment Unit',
  MOBILE_MEDICAL_UNIT = 'Mobile Medical Unit',
  PARAMEDIC_UNIT = 'Paramedic Unit',
  PUMP_UNIT = 'Pump Unit',
}

export enum ResourceCategory {
  INDIVIDUAL = 'Individual',
  UNIT = 'Unit',
  VEHICLE = 'Vehicle',
}

export const CategoryToTypesMap: Record<ResourceCategory, ResourceType[]> = {
  [ResourceCategory.INDIVIDUAL]: [
    ResourceType.EMT,
    ResourceType.FIREFIGHTER,
    ResourceType.HAZMAT_TECH,
    ResourceType.RESCUE_PERSONNEL,
    ResourceType.TECHNICIAN,
  ],
  [ResourceCategory.UNIT]: [
    ResourceType.DECONTAMINATION_UNIT,
    ResourceType.ENGINEERING_UNIT,
    ResourceType.HEAVY_EQUIPMENT,
    ResourceType.MOBILE_MEDICAL_UNIT,
    ResourceType.PARAMEDIC_UNIT,
    ResourceType.PUMP_UNIT,
  ],
  [ResourceCategory.VEHICLE]: [
    ResourceType.AMBULANCE,
    ResourceType.BOAT,
    ResourceType.COMMAND_VEHICLE,
    ResourceType.FIRE_TRUCK,
    ResourceType.HAZMAT_VEHICLE,
    ResourceType.RESCUE_VEHICLE,
    ResourceType.UTILITY_TRUCK,
    ResourceType.WATER_TANKER,
  ],
}
