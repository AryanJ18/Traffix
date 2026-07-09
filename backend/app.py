# uvicorn app.main:app --reload
#uvicorn backend.app:app --reload for the root dir
from fastapi import FastAPI
from pydantic import BaseModel
import mlflow
import mlflow.sklearn
import pandas as pd

app = FastAPI()

# Tell MLflow to use the project tracking database
mlflow.set_tracking_uri("sqlite:///mlflow.db")

# Load your best model
model = mlflow.sklearn.load_model("runs:/d925509c42ad421695200814568818a6/random_forest_model")

@app.get("/")
def home():
    return {"message": "FastAPI is working!"}