from typing import Any, Dict, List, Optional
import requests

class CustomAPIModel:
    """Custom API Model that works with the Motorola API"""
    
    def __init__(
        self, 
        api_key: str, 
        model: str, 
        user_id: str,
        base_url: str = "https://genai-service.stage.commandcentral.com/app-gateway/api/v2/chat"
    ):
        self.api_key = api_key
        self.model = model
        self.user_id = user_id
        self.base_url = base_url
    
    def generate(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate a completion for the given prompt"""
        headers = {
            "x-msi-genai-api-key": self.api_key,
            "Content-Type": "application/json"
        }

        data = {
            "userId": self.user_id,
            "model": self.model,
            "prompt": prompt,
        }
        
        # Add any additional parameters from kwargs
        for key, value in kwargs.items():
            if key not in data:
                data[key] = value

        response = requests.post(
            self.base_url,
            headers=headers,
            json=data
        )

        if response.status_code == 200:
            response_data = response.json()
            return {
                "text": response_data["msg"],
                "model": self.model
            }
        else:
            raise Exception(f"API request failed with status code {response.status_code}")