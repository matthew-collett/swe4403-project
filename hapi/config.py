import os

class Config:
    COSMOS_CONNECTION_STRING = os.getenv("COSMOS_CONNECTION_STRING")
    COSMOS_DB_ID = os.getenv("COSMOS_DB_ID")
