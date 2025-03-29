from strategies.fire_strategy import FireStrategy
from strategies.hazmat_strategy import HazmatStrategy
from strategies.infrastructure_strategy import InfrastructureStrategy
from strategies.medical_strategy import MedicalStrategy
from strategies.natural_disaster_strategy import NaturalDisasterStrategy

class StrategyFactory:
    @staticmethod
    def create_strategy(incident_type: str):
        incident_type = incident_type.upper()

        strategies = {
            'FIRE': FireStrategy,
            'HAZMAT': HazmatStrategy,
            'INFRASTRUCTURE': InfrastructureStrategy,
            'MEDICAL': MedicalStrategy,
            'NATURAL_DISASTER': NaturalDisasterStrategy,
        }

        strategy = strategies.get(incident_type)
        return strategy if strategy else None