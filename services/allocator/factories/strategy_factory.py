from strategies.fire_strategy import FireAllocationStrategy
from strategies.hazmat_strategy import HazmatAllocationStrategy
from strategies.infrastructure_strategy import InfrastructureAllocationStrategy
from strategies.medical_strategy import MedicalAllocationStrategy
from strategies.natural_disaster_strategy import NaturalDisasterAllocationStrategy

class StrategyFactory:
    @staticmethod
    def create_strategy(incident_type: str):
        incident_type = incident_type.upper()

        strategies = {
            'FIRE': FireAllocationStrategy,
            'HAZMAT': HazmatAllocationStrategy,
            'INFRASTRUCTURE': InfrastructureAllocationStrategy,
            'MEDICAL': MedicalAllocationStrategy,
            'NATURAL_DISASTER': NaturalDisasterAllocationStrategy,
        }

        strategy = strategies.get(incident_type)
        return strategy if strategy else None