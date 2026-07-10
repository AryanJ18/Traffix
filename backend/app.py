# uvicorn app.main:app --reload
#uvicorn backend.app:app --reload for the root dir
from fastapi import FastAPI
from pydantic import BaseModel
import mlflow
import mlflow.xgboost
import pandas as pd
import sklearn

app = FastAPI()

mlflow.set_tracking_uri("sqlite:///mlflow.db")

model = mlflow.sklearn.load_model("runs:/9fd78c7ece3d4afea78e61124de227c8/random_forest_model")

@app.get("/")
def home():
    return {"message": "FastAPI is working!"}

class TrafficInput(BaseModel):
    start_area: str
    end_area: str
    distance_km: float
    time_of_day: str
    day_of_week: str
    weather_condition: str
    traffic_density_level: str
    road_type: str


EXPECTED_COLUMNS = model.feature_names_in_.tolist()

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
        "traffic_density_level": data.traffic_density_level,  # Kept intact
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