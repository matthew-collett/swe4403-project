import json
import asyncio
from api_client import send_sse_update

def lambda_handler(event, context):
    loop = asyncio.get_event_loop()
    for record in event.get("detail", []):
        message = {
            "incidentId": record.get("incidentId"),
            "status": record.get("status"),
            "description": record.get("description"),
        }
        loop.run_until_complete(send_sse_update(message))
    return {"statusCode": 200, "body": json.dumps("SSE notification sent.")}
