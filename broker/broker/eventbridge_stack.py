from aws_cdk import Stack, aws_events as events
from constructs import Construct

class EventBridgeStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        event_bus = events.EventBus(
            self, 'DisasterResponseBus',
            event_bus_name='disaster-response-bus'
        )

        self.event_bus_arn = event_bus.event_bus_arn