from fastapi import FastAPI
from .routers import habit

app = FastAPI(
    title="The Orbit",
    version="1.0.0"
)

app.include_router(habit.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Habit-Building AI Service API"}

@app.get("/health")
async def root():
    return {"message": "Ok"}