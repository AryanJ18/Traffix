from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_predict():
    response = client.post("/predict",
        json={
            "start_area": "Rohini",
            "end_area": "Dwarka",
            "distance_km": 10,
            "time_of_day": "Morning",
            "day_of_week": "Weekday",
            "weather_condition": "Clear",
            "road_type": "Main Road"
        }
    )

    assert response.status_code == 200
    assert "predicted_travel_time_minutes" in response.json()