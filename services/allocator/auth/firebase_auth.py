import firebase_admin
from firebase_admin import credentials, auth
import requests
import os
import time

class FirebaseAuthManager:
    def __init__(self, service_uid: str):
        self.service_uid = service_uid
        self.api_key = os.getenv("FIREBASE_API_KEY")
        self.cred_path = "/opt/allocator/auth/firebase-service-account.json"
        self.id_token = None
        self.token_expiry = 0

        if not firebase_admin._apps:
            cred = credentials.Certificate(self.cred_path)
            firebase_admin.initialize_app(cred)

    def get_id_token(self):
        if not self.id_token or time.time() >= self.token_expiry:
            self._refresh_token()
        return self.id_token

    def _refresh_token(self):
        custom_token = auth.create_custom_token(self.service_uid)

        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key={self.api_key}"
        response = requests.post(
            url,
            headers={"Content-Type": "application/json"},
            json={"token": custom_token.decode(), "returnSecureToken": True}
        )

        response.raise_for_status()
        data = response.json()
        self.id_token = data["idToken"]
        self.token_expiry = time.time() + int(data["expiresIn"]) - 30
