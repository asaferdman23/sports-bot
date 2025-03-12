from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from custom_api_model import CustomAPIModel
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your Next.js domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize your custom model
custom_model = CustomAPIModel(
    api_key=os.environ.get("H:Pp*Az,Wh83R!AfLbdCZ*4BYj3A3AQZ*baH3byS"),
    model=os.environ.get("ChatGPT4o"),
    user_id=os.environ.get("fkpx38@motorolasolutions.com")
)

class PromptRequest(BaseModel):
    prompt: str

@app.post("/generate")
async def generate(request: PromptRequest):
    try:
        response = custom_model.generate(request.prompt)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run with: uvicorn api_server:app --reload 