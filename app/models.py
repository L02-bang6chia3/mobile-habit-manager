from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone
from uuid import uuid4

class Frequency(BaseModel):
    type: str  # e.g., "weekly", "daily"
    days: Optional[List[str]] = None

class HabitModel(BaseModel):
    # This model represents the database document
    id: str = Field(default_factory=lambda: str(uuid4()), alias="_id")
    user_id: str
    title: str
    goal_value: int
    unit: str
    frequency: Frequency
    reminder_time: str
    category: str
    priority: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        populate_by_name = True