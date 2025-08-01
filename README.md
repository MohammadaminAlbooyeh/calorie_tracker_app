# Calorie Tracker

A simple calorie tracking app with a FastAPI backend and React Native (Expo) frontend.

## Features

- Add foods and their quantities to your daily log
- Automatic calorie calculation based on a food database
- View a list of all foods eaten with total calories
- Pie chart for macronutrient distribution (static sample)
- Case-insensitive food name entry
- Clear all foods from the log

## Technologies

- **Backend:** FastAPI (Python)
- **Frontend:** React Native (Expo)
- **Chart:** react-native-chart-kit

## Getting Started

### Backend

1. **Install dependencies:**
    ```bash
    pip install fastapi uvicorn
    ```
2. **Run the server:**
    ```bash
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    ```
3. **Food database:**  
   Edit `foods_db.py` to update or add foods and their calories.

### Frontend

1. **Install Node.js and npm** (if not already installed).
2. **Install dependencies:**
    ```bash
    npm install
    npm install react-native-chart-kit react-native-svg
    ```
3. **Start Expo:**
    ```bash
    npx expo start
    ```
4. **Test on your phone:**  
   - Install Expo Go app on your Android/iOS device.
   - Scan the QR code shown in the terminal/browser.

### API Endpoints

- `POST /add_food`  
  Add a food to the log.  
  **Body:**  
  ```json
  {
    "name": "Apple",
    "quantity": 2
  }
  ```
- `GET /foods`  
  Get the list of logged foods.

- `DELETE /foods`  
  Clear all logged foods.

## Notes

- Food names are case-insensitive.
- Most food calories are per 100g, but fruits are per piece (see `foods_db.py`).
- The frontend food list and chart are local; for full integration, connect frontend to backend endpoints

---