resource_requirements = {
    'FIRE': {
        'LOW': {
            'FireTruck': 1,
            'Firefighter': 3
        },
        'MEDIUM': {
            'FireTruck': 2,
            'Ambulance': 1,
            'Firefighter': 5,
            'EMT': 2
        },
        'HIGH': {
            'FireTruck': 3,
            'Ambulance': 2,
            'WaterTanker': 1,
            'Firefighter': 8,
            'EMT': 4,
            'CommandVehicle': 1
        }
    },
    'MEDICAL': {
        'LOW': {
            'Ambulance': 1,
            'EMT': 2
        },
        'MEDIUM': {
            'Ambulance': 1,
            'EMT': 2,
            'Paramedic': 1
        },
        'HIGH': {
            'Ambulance': 3,
            'EMT': 6,
            'Paramedic': 2,
            'MobileMedical': 1,
            'CommandVehicle': 1
        }
    },
    'INFRASTRUCTURE': {
        'LOW': {
            'UtilityTruck': 1,
            'Technician': 2
        },
        'MEDIUM': {
            'UtilityTruck': 2,
            'Technician': 4,
            'HeavyEquipment': 1
        },
        'HIGH': {
            'UtilityTruck': 3,
            'Technician': 6,
            'HeavyEquipment': 2,
            'Engineer': 1,
            'CommandVehicle': 1
        }
    },
    'NATURAL_DISASTER': {
        'LOW': {
            'RescueVehicle': 1,
            'RescuePersonnel': 2,
            'PumpUnit': 1
        },
        'MEDIUM': {
            'RescueVehicle': 2,
            'Boat': 1,
            'RescuePersonnel': 4,
            'PumpUnit': 2
        },
        'HIGH': {
            'RescueVehicle': 3,
            'Boat': 2,
            'RescuePersonnel': 6,
            'PumpUnit': 3,
            'CommandVehicle': 1
        }
    },
    'HAZMAT': {
        'LOW': {
            'HazmatVehicle': 1,
            'HazmatTech': 2
        },
        'MEDIUM': {
            'HazmatVehicle': 1,
            'FireTruck': 1,
            'HazmatTech': 4,
            'Firefighter': 2
        },
        'HIGH': {
            'HazmatVehicle': 2,
            'FireTruck': 2,
            'HazmatTech': 6,
            'Firefighter': 4,
            'DeconUnit': 1,
            'CommandVehicle': 1
        }
    }
}
