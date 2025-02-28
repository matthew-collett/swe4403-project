#!/usr/bin/env python3
import aws_cdk as cdk
from broker.eventbridge_stack import EventBridgeStack

app = cdk.App()

eventbridge_stack = EventBridgeStack(app, "EventBridgeStack")

app.synth()