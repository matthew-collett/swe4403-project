#!/usr/bin/env python3
import aws_cdk as cdk
from broker.broker.eventbridge_stack import EventBridgeStack
from aws_cdk import aws_lambda as _lambda

app = cdk.App()

# Dummy Lambda Functions (Replace with actual service Lambdas)
allocator_lambda = _lambda.Function(
    app, "Allocator",
    runtime=_lambda.Runtime.PYTHON_3_13,
    handler="allocator.handler.lambda_handler",
    code=_lambda.Code.from_asset("../services/resource_allocator/lambda")
)

notifier_lambda = _lambda.Function(
    app, "NotifierLambda",
    runtime=_lambda.Runtime.PYTHON_3_13,
    handler="notifier.handler.lambda_handler",
    code=_lambda.Code.from_asset("../services/notifier/lambda")
)

# Instantiate the EventBridge Stack
EventBridgeStack(
    app, "EventBridgeStack",
    allocator_lambda=allocator_lambda,
    notifier_lambda=notifier_lambda
)

app.synth()