from aws_cdk import (
    Stack,
    aws_lambda as _lambda,
    aws_events as events,
    aws_events_targets as targets,
    aws_iam as iam,
    aws_sns as sns,
    aws_sns_subscriptions as subs
)
from constructs import Construct

class NotifierStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        notifier_lambda = _lambda.Function(
            self, "NotifierLambda",
            runtime=_lambda.Runtime.PYTHON_3_10,
            handler="handler.lambda_handler",
            code=_lambda.Code.from_asset("./handler"),
            environment={
                "EVENT_BUS_NAME": "DisasterResponseBus"
            }
        )

        event_rule = events.Rule(
            self, "NotifierRule",
            event_pattern={
                "source": ["disaster.response.api"],
                "detail-type": ["incident.new", "incident.update", "incident.resolved"]
            },
            event_bus=events.EventBus.from_event_bus_name(self, "EventBus", "DisasterResponseBus")
        )
        
        event_rule.add_target(targets.LambdaFunction(notifier_lambda))

        notifier_lambda.add_to_role_policy(iam.PolicyStatement(
            actions=["events:PutEvents"],
            resources=["arn:aws:events:*:*:event-bus/DisasterResponseBus"]
        ))
