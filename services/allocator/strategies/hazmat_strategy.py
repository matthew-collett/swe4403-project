from strategies.allocation_strategy import AllocationStrategy


class HazmatStrategy(AllocationStrategy):
    def __init__(self):
        super().__init__('HAZMAT')
