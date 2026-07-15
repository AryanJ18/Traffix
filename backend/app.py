# uvicorn app.main:app --reload
#uvicorn backend.app:app --reload for the root dir
from fastapi import FastAPI
from pydantic import BaseModel
import mlflow
import mlflow.xgboost
import pandas as pd
import sklearn
from fastapi.middleware.cors import CORSMiddleware
import joblib
import os
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# mlflow.set_tracking_uri("sqlite:///mlflow.db")

# model = mlflow.sklearn.load_model("runs:/c8adbeb46ff6405190e468b41de84505/random_forest_model")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'random_forest.pkl')
model = joblib.load(MODEL_PATH)

class TrafficInput(BaseModel):
    start_area: str
    end_area: str
    distance_km: float
    time_of_day: str
    day_of_week: str
    weather_condition: str
    road_type: str


EXPECTED_COLUMNS = model.feature_names_in_.tolist()

# app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="static")

@app.post("/predict")
def predict(data: TrafficInput):
    # 1. Create a empty DataFrame with 0s, with the training columns 
    input_df = pd.DataFrame(0, index=[0], columns=EXPECTED_COLUMNS)

    # 2. Assigning the numeric variable directly
    input_df["distance_km"] = data.distance_km

    # 3. Assigning  all categorical variables
    categorical_features = {
        "start_area": data.start_area,
        "end_area": data.end_area,
        "time_of_day": data.time_of_day,
        "day_of_week": data.day_of_week,
        "weather_condition": data.weather_condition,
        "road_type": data.road_type
    }

    # 4. Flip the matching column to 1 if it exists in the model's expectations
    for feature, value in categorical_features.items():
        dummy_col_name = f"{feature}_{value}"
        if dummy_col_name in EXPECTED_COLUMNS:
            input_df[dummy_col_name] = 1

    # 5. Execute Prediction
    prediction = round(model.predict(input_df)[0], 2)

    return {
        "predicted_travel_time_minutes": float(prediction)
    }

STATIC_PATH = os.path.join(BASE_DIR, 'static')
if os.path.exists(STATIC_PATH):
    app.mount("/", StaticFiles(directory=STATIC_PATH, html=True), name="static")
else:
    print("Warning: Static folder not found. Frontend will not be served.")