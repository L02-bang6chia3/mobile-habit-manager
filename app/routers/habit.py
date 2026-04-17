from bson import ObjectId
from fastapi import APIRouter, Body, HTTPException, status, Query, Path
from fastapi.encoders import jsonable_encoder
from typing import List, Annotated
from datetime import datetime, timezone
from ..database import habit_collection
from ..schemas import HabitCreate, HabitUpdate, HabitResponse

router = APIRouter(
    prefix="/habits",
    tags=["habits"]
)


@router.post("/", response_description="Create new habit", response_model=HabitResponse,
             status_code=status.HTTP_201_CREATED)
async def create_habit(habit: HabitCreate = Body(...)):
    habit_data = jsonable_encoder(habit)
    habit_data["created_at"] = datetime.now(timezone.utc)
    new_habit = await habit_collection.insert_one(habit_data)
    created_habit = await habit_collection.find_one({"_id": new_habit.inserted_id})
    return created_habit


# pagination:
#   10 habits per page
@router.get("/", response_description="Get habit list", response_model=List[HabitResponse])
async def list_habits(page: Annotated[int, Query()] = 1):
    skip = (page - 1) * 10
    habits = await habit_collection.find().skip(skip).limit(10).to_list()
    return habits


@router.get("/{id}", response_description="Get habit's detail", response_model=HabitResponse)
async def get_habit(habit_id: Annotated[str, Path(alias="id")]):
    if (habit := await habit_collection.find_one({"_id": ObjectId(habit_id)})) is not None:
        return habit
    raise HTTPException(status_code=404, detail=f"Not found habit ID: {habit_id}")


@router.put("/{id}", response_description="Update habit", response_model=HabitResponse)
async def update_habit(habit_id: Annotated[str, Path(alias="id")], habit: HabitUpdate = Body(...)):
    update_data = {k: v for k, v in habit.model_dump().items() if v is not None}

    object_habit_id = ObjectId(habit_id)
    if len(update_data) >= 1:
        update_result = await habit_collection.update_one({"_id": object_habit_id}, {"$set": update_data})
        if update_result.modified_count == 1:
            if (updated_habit := await habit_collection.find_one({"_id": object_habit_id})) is not None:
                return updated_habit

    if (existing_habit := await habit_collection.find_one({"_id": object_habit_id})) is not None:
        return existing_habit
    raise HTTPException(status_code=404, detail=f"Not found habit ID: {object_habit_id}")


@router.delete("/{id}", response_description="Delete habit")
async def delete_habit(habit_id: Annotated[str, Path(alias="id")]):
    result = await habit_collection.delete_one({"_id": ObjectId(habit_id)})
    if result.deleted_count == 1:
        return {"message": "Success delete"}
    raise HTTPException(status_code=404, detail=f"Not found habit ID: {habit_id}")