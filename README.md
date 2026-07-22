# 🚦 TraffiX - Smart Traffic Congestion Predictor

TraffiX is a machine learning-powered web application that predicts travel time between two locations based on road, weather, and temporal conditions. It combines an interactive map interface with a trained ML model served through a FastAPI backend, while following modern MLOps practices such as experiment tracking, Docker containerization, CI/CD, and automated deployments.

---

## 📌 Features

- 🗺️ Interactive map with route visualization
- 📍 Source and destination search
- 🚗 Route generation using OSRM
- 🤖 ML-powered travel time prediction
- 📊 Experiment tracking using MLflow
- ⚡ FastAPI REST API
- ⚛️ React + Vite frontend
- 🐳 Dockerized application
- 🔄 GitHub Actions CI/CD workflows

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- OpenStreetMap
- OSRM Routing API

### Backend
- FastAPI
- Pandas
- NumPy
- Scikit-learn
- XGBoost
- Uvicorn

### MLOps
- MLflow
- Docker
- GitHub Actions
- Render (Deployment)

---

## 📂 Project Structure

```
TraffiX/
│
├── backend/
│   ├── app.py
│   ├── train.py
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── models/
│
├── mlruns/
│
├── .github/
│   └── workflows/
│
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🧠 Machine Learning Pipeline

1. Load traffic dataset
2. Data preprocessing
3. Feature engineering
4. Train model
5. Evaluate model
6. Log experiments using MLflow
7. Register best model
8. Serve model through FastAPI

---

## 📊 Features Used

The prediction model considers:

- Starting Area
- Destination Area
- Distance (km)
- Time of Day
- Day of Week
- Weather Condition
- Road Type

**Target**

- Estimated Travel Time (minutes)

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/yourusername/TraffiX.git

cd TraffiX
```

---

### Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn app:app --reload
```

Backend runs on:

```
http://localhost:8000
```

---

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🐳 Docker

Build image

```bash
docker build -t traffix .
```

Run container

```bash
docker run -p 8000:8000 traffix
```

---

## 📈 MLflow

Start MLflow UI

```bash
mlflow ui
```

Open

```
http://localhost:5000
```

---

## 🔄 CI/CD

GitHub Actions automate:

- ✅ Backend testing
- ✅ Frontend build
- ✅ Docker image build
- ✅ Image push to Docker Hub
- ✅ Deployment to Render

---

## 🌍 API Endpoints

### Home

### Predict Travel Time

```
POST /predict
```

Example request:

```json
{
  "start_area": "Connaught Place",
  "end_area": "Dwarka",
  "distance_km": 18,
  "time_of_day": "Evening",
  "day_of_week": "Weekday",
  "weather_condition": "Clear",
  "road_type": "Main Road"
}
```

Example response

```json
{
  "predicted_travel_time_minutes": 34.8
}
```
