#Step 1: Install FastAPI and an ASGI server, such as Uvicorn
#You can do this by running `pip install fastapi uvicorn` in your terminal

from fastapi import FastAPI
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

origins = ["http://localhost:8000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Step 3: Define a list to hold the goals
goals = []

class Goal(BaseModel):
    ID: str
    Text: str

@app.post("/goals/")
async def create_goal(goal: Goal):
    goals.append(goal)
    return {"goal": goal.Text}

# Step 5: Create a GET operation to retrieve all goals
@app.get("/goals/")
async def read_goals():
    return {"goals": goals}

@app.get("/goals/maxID/")
async def get_maxID():
    maxID = 0
    for goal in goals:
        if goal.ID > maxID:
            maxID = goal.ID
    return {"maxID": maxID}

# Step 6: Create a DELETE operation to remove a goal
@app.delete("/goals/{goal_id}")
async def delete_goal(goal_id: str):
    for goal in goals:
        if goal.ID == goal_id:
            goals.remove(goal)
            return {"message": "Goal with ID " + str(goal_id) + " deleted"}
    return {"message": "Goal with ID " + str(goal_id) + " not found"}

