from fastapi import FastAPI
from routes import items  # Import the items module

app = FastAPI()

app.include_router(items.router)  # Register the router

@app.get("/")
def home():
    return {"message": "Hello, it's working!"}