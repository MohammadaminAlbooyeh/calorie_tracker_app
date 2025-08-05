import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Calendar } from 'react-native-calendars';

// Base URL for your FastAPI backend
const API_BASE_URL = 'http://YOUR_LOCAL_IP:8000'; // Change to your actual IP

function MainScreen({ navigation }) {
  const [foods, setFoods] = useState([]);
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableFoods, setAvailableFoods] = useState({});

  const fetchFoods = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/foods`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setFoods(data.foods);
    } catch (err) {
      console.error("Failed to fetch foods:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFoodSuggestions = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/food_suggestions`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setAvailableFoods(data);
    } catch (err) {
      console.error("Failed to fetch food suggestions:", err);
    }
  }, []);

  useEffect(() => {
    fetchFoods();
    fetchFoodSuggestions();
  }, [fetchFoods, fetchFoodSuggestions]);

  useEffect(() => {
    const trimmedFoodName = foodName.trim().toLowerCase();
    // Normalize availableFoods keys to lowercase for matching
    const foodsLower = Object.keys(availableFoods).reduce((acc, key) => {
      acc[key.toLowerCase()] = availableFoods[key];
      return acc;
    }, {});
    if (trimmedFoodName && foodsLower[trimmedFoodName]) {
      setUnit(foodsLower[trimmedFoodName]);
    } else {
      setUnit('');
    }
  }, [foodName, availableFoods]);

  const handleAddFood = async () => {
    setError('');
    const name = foodName.trim().toLowerCase();
    const qty = parseFloat(quantity);
    if (!name || isNaN(qty) || qty <= 0) {
      setError('Please enter valid food and quantity.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/add_food`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, quantity: qty }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add food');
      }
      await fetchFoods();
      setFoodName('');
      setQuantity('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalCalories = foods.reduce((sum, item) => sum + item.calories, 0);
  const maxCalories = 2000;
  const caloriePercent = Math.min((totalCalories / maxCalories) * 100, 100);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>Calorie Tracker</Text>
      <View style={{ width: '80%', alignItems: 'center' }}>
        <View style={{ width: '100%', height: 30, backgroundColor: '#eee', borderRadius: 15, overflow: 'hidden', marginBottom: 12 }}>
          <View style={{ width: `${caloriePercent}%`, height: '100%', backgroundColor: '#22c55e', borderRadius: 15 }} />
        </View>
        <Text style={{ fontSize: 18, marginBottom: 24 }}>{Math.round(totalCalories)}/{maxCalories} kcal ({Math.round(caloriePercent)}%)</Text>
        <TextInput
          style={{ width: '100%', height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, marginBottom: 8 }}
          placeholder="Food name"
          value={foodName}
          onChangeText={setFoodName}
        />
        <TextInput
          style={{ width: '100%', height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, marginBottom: 8 }}
          placeholder="Quantity"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={{ width: '100%', height: 40, backgroundColor: '#22c55e', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}
          onPress={handleAddFood}
          disabled={loading}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Add</Text>
        </TouchableOpacity>
        {error ? <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text> : null}
        {/* Table of added foods */}
        <View style={{ width: '100%', marginTop: 8 }}>
          {foods.length > 0 && (
            <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, overflow: 'hidden' }}>
              <View style={{ flexDirection: 'row', backgroundColor: '#f3f3f3', padding: 8 }}>
                <Text style={{ flex: 2, fontWeight: 'bold' }}>Food</Text>
                <Text style={{ flex: 1, fontWeight: 'bold', textAlign: 'center' }}>Qty</Text>
                <Text style={{ flex: 1, fontWeight: 'bold', textAlign: 'center' }}>Cal</Text>
              </View>
              {foods.map((item, idx) => (
                <View key={idx} style={{ flexDirection: 'row', padding: 8, borderTopWidth: idx === 0 ? 0 : 1, borderColor: '#eee' }}>
                  <Text style={{ flex: 2 }}>{item.name}</Text>
                  <Text style={{ flex: 1, textAlign: 'center' }}>{item.quantity}</Text>
                  <Text style={{ flex: 1, textAlign: 'center' }}>{Math.round(item.calories)}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

function DailyConsumptionScreen() {
  return (
    <View style={styles.screen}>
      <Text>Daily Consumption Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DailyConsumption"
          component={DailyConsumptionScreen}
          options={{ title: 'Daily Consumption' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  // ... (keep all your existing styles)
  // Add any additional styles you need
});