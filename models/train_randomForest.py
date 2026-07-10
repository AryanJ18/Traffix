import pandas as pd
import numpy as np
import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

model = RandomForestRegressor()

X = pd.read_csv("data/delhi_traffic_features.csv")
y = pd.read_csv("data/delhi_traffic_target.csv")["travel_time_minutes"]

X.columns = X.columns.str.strip()

X = X.drop(
    columns=["average_speed_kmph", "Trip_ID", "traffic_density_level"],
    errors="ignore"
)

X = pd.get_dummies(X, drop_first=True) #converison of strign data into numbers

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.4,
    random_state=42
)

#Hyperparameters
n_estimators = 500
max_depth = 20


mlflow.set_experiment("Traffic_Congestion_Prediction")

with mlflow.start_run():
    # A. Log Parameters
    mlflow.log_params({"n_estimators": n_estimators, "max_depth": max_depth})
    
    # B. Train Model
    model = RandomForestRegressor(
        n_estimators= n_estimators,
        max_depth= max_depth,
        random_state= 42
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
    mlflow.sklearn.log_model(model, "random_forest_model")
    
    print(f"Run Logged Successfully! \n MSE: {mse:.2f}, R2: {r2:.2f}, Accuracy: {accuracy_percentage:.2f}%")