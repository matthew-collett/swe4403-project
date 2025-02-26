import aws_cdk as core
import aws_cdk.assertions as assertions

from broker.broker.eventbridge_stack import EventBridgeStack

# example tests. To run these tests, uncomment this file along with the example
# resource in broker/broker_stack.py
def test_sqs_queue_created():
    app = core.App()
    stack = BrokerStack(app, "broker")
    template = assertions.Template.from_stack(stack)

#     template.has_resource_properties("AWS::SQS::Queue", {
#         "VisibilityTimeout": 300
#     })
