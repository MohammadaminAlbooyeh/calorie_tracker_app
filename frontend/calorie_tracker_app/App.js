import 'react-native-gesture-handler';
import React, { useState, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DailyConsumptionScreen from './DailyConsumptionScreen';
import { View, Text, StyleSheet, Image, FlatList, ScrollView, TextInput, Button, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // You might not need this anymore if unit is auto-set
import { Calendar } from 'react-native-calendars';

// Base URL for your FastAPI backend
const API_BASE_URL = 'http://localhost:8000'; // **IMPORTANT: Change this to your backend IP/URL if not running on localhost or on a physical device**

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function MainScreen({ navigation }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [foods, setFoods] = useState([]);
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [availableFoods, setAvailableFoods] = useState({});

  // Function to fetch all foods from the backend
  const fetchFoods = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/foods`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setFoods(data.foods);
    } catch (err) {
      console.error("Failed to fetch foods:", err);
      Alert.alert("Error", "Could not load foods from server.");
      setError("Could not load foods.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to fetch available food suggestions (names and units) from the backend
  const fetchFoodSuggestions = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/food_suggestions`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAvailableFoods(data);
    } catch (err) {
      console.error("Failed to fetch food suggestions:", err);
      Alert.alert("Error", "Could not load food suggestions.");
    }
  }, []);

  useEffect(() => {
    fetchFoods();
    fetchFoodSuggestions();
  }, [fetchFoods, fetchFoodSuggestions]);

  // Set unit automatically when foodName changes, based on backend data (CASE-INSENSITIVE)
  useEffect(() => {
    const trimmedFoodName = foodName.trim().toLowerCase();
    if (trimmedFoodName) {
      const foodKey = Object.keys(availableFoods).find(
        key => key.toLowerCase() === trimmedFoodName
      );
      if (foodKey) {
        setUnit(availableFoods[foodKey]);
      } else {
        setUnit('');
      }
    } else {
      setUnit('');
    }
  }, [foodName, availableFoods]);

  const handleAddFood = async () => {
    setError('');
    const name = foodName.trim();
    const qty = parseInt(quantity);

    if (!name || isNaN(qty) || qty <= 0 || !unit) {
      setError('Please enter valid food, quantity, and unit.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/add_food`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, quantity: qty }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || `HTTP error! status: ${response.status}`);
      }
      fetchFoods();
      setFoodName('');
      setQuantity('');
      setUnit('');
    } catch (err) {
      console.error("Failed to add food:", err);
      setError(err.message || "Failed to add food. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalCalories = foods.reduce((sum, item) => sum + item.calories, 0);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ position: 'absolute', left: 20, top: 60 }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#fff' }}>≡</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Calorie Tracker</Text>
      </View>
      {showCalendar && (
        <View style={{ position: 'absolute', top: 100, left: 0, right: 0, zIndex: 50, backgroundColor: '#fff', borderRadius: 12, margin: 20, padding: 10, elevation: 10 }}>
          <TouchableOpacity onPress={() => setShowCalendar(false)} style={{ alignSelf: 'flex-end', padding: 8 }}>
            <Text style={{ fontSize: 22 }}>×</Text>
          </TouchableOpacity>
          <Calendar
            onDayPress={day => setSelectedDate(day.dateString)}
            markedDates={{ [selectedDate]: { selected: true, selectedColor: '#22c55e' } }}
            style={{ margin: 10, borderRadius: 10 }}
          />
        </View>
      )}
      {/* ...existing code... */}
      <View style={styles.addBox}>
        <Text style={styles.addTitle}>Add Food</Text>
        <TextInput
          style={styles.input}
          placeholder="Food name (e.g. Apple)"
          value={foodName}
          onChangeText={setFoodName}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Quantity"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />
        <View style={{marginBottom: 8}}>
          <Text style={{fontSize: 16, color: unit ? '#222' : '#aaa', padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, backgroundColor: '#f9f9f9'}}>
            {unit ? `Unit: ${unit}` : 'Unit will appear here based on food name'}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleAddFood} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addButtonText}>Add</Text>
          )}
        </TouchableOpacity>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
      {loading && foods.length === 0 ? (
        <ActivityIndicator size="large" color="#22c55e" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={foods}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.foodRow}>
              <Text style={styles.foodName}>{item.name} x{item.quantity} {item.unit}</Text>
              <Text style={styles.calories}>{Math.round(item.calories)} cals</Text>
            </View>
          )}
          style={{ width: '100%' }}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#aaa', marginTop: 10 }}>No foods added yet.</Text>}
        />
      )}
      <View style={styles.totalsRow}>
        <Text style={styles.totalsLabel}>Day Totals</Text>
        <Text style={styles.totalsValue}>{Math.round(totalCalories)} cals</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: '#22c55e', paddingTop: 60, paddingBottom: 20, alignItems: 'center' },
  headerText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  addBox: {
    backgroundColor: '#f3f4f6',
    margin: 18,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    elevation: 2,
  },
  addTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#222' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#22c55e',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 4,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  error: { color: 'red', marginTop: 4, textAlign: 'center' },
  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  icon: { width: 32, height: 32, marginRight: 16 }, // Not used currently
  foodName: { flex: 1, fontSize: 18 },
  calories: { fontSize: 18, color: '#22c55e', fontWeight: 'bold' },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    alignItems: 'center',
  },
  totalsLabel: { fontWeight: 'bold', fontSize: 18, color: '#444' },
  totalsValue: { fontWeight: 'bold', fontSize: 18, color: '#222' },
});

function AppDrawer() {
  return (
    <Drawer.Navigator 
      initialRouteName="Home"
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#fff',
          width: 240,
        },
      }}
    >
      <Drawer.Screen name="Home" component={MainScreen} />
      <Drawer.Screen name="Daily Consumption" component={DailyConsumptionScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <AppDrawer />
      </View>
    </NavigationContainer>
  );
}