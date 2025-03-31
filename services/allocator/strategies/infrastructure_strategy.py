from strategies.allocation_strategy import AllocationStrategy


class InfrastructureStrategy(AllocationStrategy):
    def __init__(self):
        super().__init__('INFRASTRUCTURE')
