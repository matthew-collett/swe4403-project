import httpx
import json

API_URL = "http://127.0.0.1:8080/notifier"

async def send_sse_update(message: dict):
    async with httpx.AsyncClient() as client:
        response = await client.post(API_URL, json=message)
        response.raise_for_status()
