from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

checkins = []


class CheckIn(BaseModel):
    name: str
    sleep: float
    water: int
    steps: int


@app.get("/api/checkins")
def get_checkins():
    return checkins


@app.post("/api/checkins")
def add_checkin(data: CheckIn):
    entry = data.model_dump()
    entry["hit_goal"] = data.steps >= 10000
    checkins.append(entry)
    return {"success": True, "stored": entry}
