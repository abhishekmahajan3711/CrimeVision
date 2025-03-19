import numpy as np
import pandas as pd
from flask_cors import CORS  
from flask import Flask, request, jsonify
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load data
data = pd.read_csv('Maharashtra_Grouped_Crime_Data1.csv')

# Convert categorical columns to numerical
data['DistrictID'] = data['DistrictName'].astype('category').cat.codes
data['StationID'] = data['PoliceStationName'].astype('category').cat.codes
data['AlertID'] = data['AlertType'].astype('category').cat.codes

data = data.sort_values(by=['DistrictID', 'StationID'])

# Feature selection
features = data[['DistrictID', 'StationID', 'AlertID']]
target = data['No_of_Crimes']

# Scaling
feature_scaler = MinMaxScaler()
features_scaled = feature_scaler.fit_transform(features)

target_scaler = MinMaxScaler()
target = target.values.reshape(-1, 1)
target_scaled = target_scaler.fit_transform(target)

# Prepare data for LSTM
X, y = [], []
n_steps = 7  # Predicting for the next 7 days

for i in range(len(features_scaled) - n_steps):
    X.append(features_scaled[i])
    y.append(target_scaled[i + 1:i + n_steps + 1].flatten())

X, y = np.array(X), np.array(y)
X = np.expand_dims(X, axis=1)  # Reshape for LSTM

# Build LSTM model
model = Sequential()
model.add(LSTM(50, activation='relu', input_shape=(X.shape[1], X.shape[2])))
model.add(Dense(n_steps))  # 7 output values
model.compile(optimizer='adam', loss='mse')

# Train model
model.fit(X, y, epochs=20, batch_size=32, validation_split=0.2)

# Prediction function
def predict_crime(input_data):
    """
    Predict the number of crimes for the next 7 days.
    :param input_data: List of features [DistrictID, StationID, AlertID]
    :return: Predicted crime numbers for the next 7 days
    """
    input_scaled = feature_scaler.transform(np.array(input_data).reshape(1, -1))
    prediction = model.predict(np.expand_dims(input_scaled, axis=0))
    return target_scaler.inverse_transform(prediction)[0].tolist()  # Convert to a list for JSON response

# Flask Route for Prediction
@app.route('/predict', methods=['POST'])
def predict():
    """
    API Endpoint to get crime predictions.
    Example JSON Input:
    {
        "district_id": 6,
        "station_id": 40,
        "alert_id": 4
    }
    """
    data = request.json
    input_data = [data['district_id'], data['station_id'], data['alert_id']]
    predicted_crimes = predict_crime(input_data)

    return jsonify(predicted_crimes)  # Return as JSON array

# Run Flask app
if __name__ == '__main__':
    app.run(debug=True)
