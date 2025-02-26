import httpx
import json

API_URL = "http://api-url-here/broadcast"  # Update with actual URL

async def send_sse_update(message: dict):
    async with httpx.AsyncClient() as client:
        response = await client.post(API_URL, json=message)
        response.raise_for_status()
