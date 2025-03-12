import json
import asyncio
from api_client import send_sse_update

def lambda_handler(event, context):
    loop = asyncio.get_event_loop()
    for record in event.get("detail", []):
        message = {
            "id": record.get("id"),
            "type": record.get("type"),
            "severity": record.get("severity"),
            "status": record.get("status"),
            "location": {
                "address": record.get("location", {}).get("address"),
                "coordinates": {
                    "latitude": record.get("location", {}).get("coordinates", {}).get("latitude"),
                    "longitude": record.get("location", {}).get("coordinates", {}).get("longitude")
                }
            },
            "description": record.get("description"),
            "reportedAt": record.get("reportedAt"),
            "lastUpdatedAt": record.get("lastUpdatedAt"),
            "tags": record.get("tags", [])
        }
        loop.run_until_complete(send_sse_update(message))
    return {"statusCode": 200, "body": json.dumps("SSE notification sent.")}
