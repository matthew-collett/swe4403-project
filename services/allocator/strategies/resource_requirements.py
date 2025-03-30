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
            'Utility Truck': 3,
            'Technician': 6,
            'Heavy Equipment': 2,
            'Engineer': 1,
            'Command Vehicle': 1
        }
    },
    'NATURAL_DISASTER': {
        'LOW': {
            'Rescue Vehicle': 1,
            'Rescue  Personnel': 2,
            'PumpUnit': 1
        },
        'MEDIUM': {
            'Rescue Vehicle': 2,
            'Boat': 1,
            'Rescue Personnel': 4,
            'PumpUnit': 2
        },
        'HIGH': {
            'Rescue Vehicle': 3,
            'Boat': 2,
            'Rescue Personnel': 6,
            'Pump Unit': 3,
            'Command Vehicle': 1
        }
    },
    'HAZMAT': {
        'LOW': {
            'Hazmat Vehicle': 1,
            'Hazmat Tech': 2
        },
        'MEDIUM': {
            'Hazmat Vehicle': 1,
            'Fire Truck': 1,
            'Hazmat Tech': 4,
            'Firefighter': 2
        },
        'HIGH': {
            'Hazmat Vehicle': 2,
            'Fire Truck': 2,
            'Hazmat Tech': 6,
            'Firefighter': 4,
            'Decon Unit': 1,
            'Command Vehicle': 1
        }
    }
}
