import os
import sentry_sdk
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv(override=True)

# --- Sentry Monitoring Setup ---
sentry_dsn = os.getenv("SENTRY_DSN", "")
if sentry_dsn and sentry_dsn != "YOUR_SENTRY_DSN":
    sentry_sdk.init(
        dsn=sentry_dsn,
        traces_sample_rate=1.0,
        profiles_sample_rate=1.0,
    )

app = FastAPI(title="Chatbot Backend API")

# Add CORS middleware for local development tunneling (Ngrok)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Supabase Database Setup ---
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
supabase: Client | None = None
if SUPABASE_URL and SUPABASE_KEY and SUPABASE_URL != "YOUR_SUPABASE_PROJECT_URL":
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- Gemini Setup ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY and GEMINI_API_KEY != "YOUR_GEMINI_API_KEY":
    genai.configure(api_key=GEMINI_API_KEY)
    
class ChatRequest(BaseModel):
    message: str
    user_id: str | None = None

class ChatResponse(BaseModel):
    reply: str
    error: str | None = None

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Backend is running!"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    if not GEMINI_API_KEY or GEMINI_API_KEY == "YOUR_GEMINI_API_KEY":
        if sentry_sdk.Hub.current.client:
            sentry_sdk.capture_message("Gemini API Key missing during chat request")
        raise HTTPException(status_code=500, detail="Gemini API Key not configured on the backend.")

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(request.message)
        
        # Optional: Save history to Supabase here if user_id is provided
        if supabase and request.user_id:
            try:
                # Example: supabase.table("chat_history").insert({"user_id": request.user_id, "message": request.message, "reply": response.text}).execute()
                pass
            except Exception as db_err:
                if sentry_sdk.Hub.current.client:
                    sentry_sdk.capture_exception(db_err)

        return ChatResponse(reply=response.text)

    except Exception as e:
        if sentry_sdk.Hub.current.client:
            sentry_sdk.capture_exception(e)  # Sentry catches backend errors
        raise HTTPException(status_code=500, detail="Failed to process chat response.")

# Optional endpoint to intentionally trigger a sentry error for testing
@app.get("/sentry-debug")
async def trigger_error():
    division_by_zero = 1 / 0
