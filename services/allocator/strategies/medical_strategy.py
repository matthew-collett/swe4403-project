from strategies.allocation_strategy import AllocationStrategy


class MedicalStrategy(AllocationStrategy):
    def __init__(self):
        super().__init__('MEDICAL')
