from aws_cdk import (
    Stack,
    aws_events as events,
    aws_events_targets as targets,
    aws_lambda as _lambda,
)
from constructs import Construct

class EventBridgeStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, allocator, notifier, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        event_bus = events.EventBus(
            self, 'DisasterResponseBus',
            event_bus_name='DisasterResponseBus'
        )

        # Rule: Trigger Resource Allocator on 'incident.new'
        new_incident_rule = events.Rule(
            self, 'NewIncidentRule',
            event_bus=event_bus,
            event_pattern={'detail-type': ['incident.new']}
        )
        new_incident_rule.add_target(targets.LambdaFunction(allocator))
    
        # Rule: Notify stakeholders on 'incident' updates
        update_incident_rule = events.Rule(
            self, 'UpdateIncidentRule',
            event_bus=event_bus,
            event_pattern={'detail-type': ['incident.update', 'incident.resolved']}
        )
        update_incident_rule.add_target(targets.LambdaFunction(notifier))

        # Output EventBus ARN (useful for publishing events)
        self.event_bus_arn = event_bus.event_bus_arn