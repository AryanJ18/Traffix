import pandas as pd
import numpy as np
import mlflow
import mlflow.xgboost
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score


model = xgb.XGBRegressor()

X = pd.read_csv("data/delhi_traffic_features.csv")
y = pd.read_csv("data/delhi_traffic_target.csv")["travel_time_minutes"]

X = pd.get_dummies(X, drop_first=True, dtype=int) 

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.4,
    random_state=42
)

# Hyperparameters
n_estimators = 100
max_depth = 5
learning_rate = 0.05

mlflow.set_experiment("Traffic_Congestion_Prediction")

with mlflow.start_run():
    # A. Log Parameters
    mlflow.log_params(
        {
            "n_estimators": n_estimators,
            "max_depth": max_depth,
            "learning_rate": learning_rate,
        }
    )

    # B. Train Model
    model = xgb.XGBRegressor(
        n_estimators=n_estimators,
        max_depth=max_depth,
        learning_rate=learning_rate,
        random_state=42,
    )

    model.fit(X_train, y_train)

    # C. Predict and Evaluate
    predictions = model.predict(X_test)
    mse = mean_squared_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)

    # MAPE calculates the average error percentage (e.g., 0.08 means 8% off)
    mape = np.mean(np.abs((y_test - predictions) / y_test))
    # Inverting it gives a clear "closeness" percentage (e.g., 100% - 8% = 92% accurate)
    accuracy_percentage = (1.0 - mape) * 100

    # D. Log Metrics (This is what allows you to compare!)
    mlflow.log_metric("mse", mse)
    mlflow.log_metric("r2_score", r2)
    mlflow.log_metric("accuracy_percentage", accuracy_percentage)

    # E. Save Model using MLflow (Replaces joblib.dump)
    mlflow.xgboost.log_model(model, "xgboost_model")

    print(
        f"Run Logged Successfully! \n MSE: {mse:.2f}, R2: {r2:.2f}, Accuracy: {accuracy_percentage:.2f}%"
    )