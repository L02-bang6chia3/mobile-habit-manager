from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Annotated
from datetime import datetime
from pydantic.functional_validators import BeforeValidator

PyObjectId = Annotated[str, BeforeValidator(str)]

class FrequencyDTO(BaseModel):
    type: str  # e.g., "weekly", "daily"
    days: Optional[List[str]] = None

class HabitCreate(BaseModel):
    user_id: str
    title: str
    goal_value: int
    unit: str
    frequency: FrequencyDTO
    reminder_time: str
    category: str
    priority: str

class HabitUpdate(BaseModel):
    title: Optional[str] = None
    goal_value: Optional[int] = None
    unit: Optional[str] = None
    frequency: Optional[FrequencyDTO] = None
    reminder_time: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None

class HabitResponse(BaseModel):
    id: PyObjectId = Field(alias="_id")
    user_id: str
    title: str
    goal_value: int
    unit: str
    frequency: FrequencyDTO
    reminder_time: str
    category: str
    priority: str
    created_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )