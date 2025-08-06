
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Calendar } from 'react-native-calendars';

// Calendar screen component (must be defined after imports)
function CalendarScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>Calendar</Text>
      <Calendar />
    </View>
  );
}

// Base URL for your FastAPI backend
const API_BASE_URL = 'http://192.168.1.110:8000';

function MainScreen({ navigation }) {
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [foodSuggestions, setFoodSuggestions] = useState({});

  // Fetch food suggestions from the backend
  const fetchFoodSuggestions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/food_suggestions`);
      if (!response.ok) {
        throw new Error('Failed to fetch food suggestions');
      }
      const data = await response.json();
      setFoodSuggestions(data);
    } catch (err) {
      setError(err.message);
    }
  };
  
  const fetchTodayFoods = useCallback(async () => {
    setLoading(true);
    try {
      const date = new Date().toISOString().split('T')[0];
      const response = await fetch(`${API_BASE_URL}/foods_by_date/${date}`);
      if (!response.ok) {
        throw new Error('Failed to fetch today\'s food log');
      }
      const data = await response.json();
      setFoods(data.foods || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchFoodSuggestions();
    fetchTodayFoods();
  }, [fetchTodayFoods]);

  // Calculate total calories and percent
  const maxCalories = 2000;
  const totalCalories = foods.reduce((sum, item) => sum + item.calories, 0);
  const caloriePercent = Math.min((totalCalories / maxCalories) * 100, 100);

  // Color for the calorie bar
  function getBarColor(percent) {
    if (percent < 60) return '#22c55e'; // green
    if (percent < 90) return '#facc15'; // yellow
    return '#ef4444'; // red
  }

  // Add food handler
  const handleAddFood = async () => {
    setError('');
    const name = foodName.trim().toLowerCase();
    const qty = parseFloat(quantity);

    if (!name || isNaN(qty) || qty <= 0) {
      setError('Please enter a valid food and quantity.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/add_food`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, quantity: qty }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to add food');
      }

      // Refetch today's food log to update the list
      fetchTodayFoods();
      setFoodName('');
      setQuantity('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteFood = async (foodId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/food/${foodId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete food');
      }
      fetchTodayFoods(); // Refresh the food list
    } catch (err) {
      setError(err.message);
    }
  };

  // Navigation (for sidebar buttons)
  // Pass foods to DailyConsumptionScreen
  function goToDailyConsumption() {
    navigation.navigate('DailyConsumption', { foods });
    setSidebarOpen(false);
  }

  // Go to Calendar screen
  function goToCalendar() {
    navigation.navigate('Calendar');
    setSidebarOpen(false);
  }


  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Sidebar overlay */}
      {sidebarOpen && (
        <View style={{ position: 'absolute', top: 0, left: 0, width: 220, height: '100%', backgroundColor: '#fff', borderRightWidth: 1, borderColor: '#ccc', zIndex: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 2, height: 0 } }}>
          <TouchableOpacity onPress={() => setSidebarOpen(false)} style={{ padding: 16, alignSelf: 'flex-end' }}>
            <Text style={{ fontSize: 24 }}>×</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: 'bold', margin: 16 }}>Menu</Text>
          {/* Sidebar buttons */}
          <TouchableOpacity style={{ padding: 16 }} onPress={goToCalendar}>
            <Text style={{ fontSize: 16 }}>Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 16 }} onPress={goToDailyConsumption}>
            <Text style={{ fontSize: 16 }}>Daily Consumption</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Hamburger icon top left */}
      {/* Hamburger icon top left */}
      <View style={{ position: 'absolute', top: 40, left: 24, zIndex: 30 }}>
        <TouchableOpacity onPress={() => setSidebarOpen(true)}>
          <Text style={{ fontSize: 32, fontWeight: 'bold' }}>≡</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>Calorie Tracker</Text>
        <View style={{ width: '80%', alignItems: 'center' }}>
          <View style={{ width: '100%', height: 30, backgroundColor: '#eee', borderRadius: 15, overflow: 'hidden', marginBottom: 12 }}>
            <View
              style={{
                width: `${caloriePercent}%`,
                height: '100%',
                backgroundColor: getBarColor(caloriePercent),
                borderRadius: 15,
              }}
            />
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
            style={{ width: '100%', height: 40, backgroundColor: '#22c55e', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}
            onPress={handleAddFood}
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
                  <View style={{ flex: 0.5 }} />{/* For spacing */}
                </View>
                {foods.map((item, idx) => (
                  <View key={idx} style={{ flexDirection: 'row', padding: 8, borderTopWidth: idx === 0 ? 0 : 1, borderColor: '#eee', alignItems: 'center' }}>
                    <Text style={{ flex: 2 }}>{item.name}</Text>
                    <Text style={{ flex: 1, textAlign: 'center' }}>{item.quantity}</Text>
                    <Text style={{ flex: 1, textAlign: 'center' }}>{Math.round(item.calories)}</Text>
                    <TouchableOpacity onPress={() => handleDeleteFood(item._id)} style={{ flex: 0.5, alignItems: 'center' }}>
                      <Text style={{ color: 'red', fontSize: 18 }}>-</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    </View>

  );
}

function DailyConsumptionScreen({ route }) {
  const foods = (route && route.params && route.params.foods) || [];
  // Calculate total macros
  let totalProtein = 0, totalFat = 0, totalCarbs = 0;
  foods.forEach(item => {
    totalProtein += (item.protein || 0) * item.quantity;
    totalFat += (item.fat || 0) * item.quantity;
    totalCarbs += (item.carbs || 0) * item.quantity;
  });
  const totalMacros = totalProtein + totalFat + totalCarbs;
  const percent = v => totalMacros > 0 ? ((v / totalMacros) * 100).toFixed(1) : '0.0';

  const pieData = [
    {
      name: `Protein (${percent(totalProtein)}%)`,
      population: totalProtein,
      color: '#60a5fa',
      legendFontColor: '#222',
      legendFontSize: 14,
    },
    {
      name: `Fat (${percent(totalFat)}%)`,
      population: totalFat,
      color: '#f87171',
      legendFontColor: '#222',
      legendFontSize: 14,
    },
    {
      name: `Carbs (${percent(totalCarbs)}%)`,
      population: totalCarbs,
      color: '#facc15',
      legendFontColor: '#222',
      legendFontSize: 14,
    },
  ].filter(item => item.population > 0);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Daily Macros</Text>
      {pieData.length > 0 ? (
        <>
          <PieChart
            data={pieData}
            width={Dimensions.get('window').width - 32}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            }}
            accessor={'population'}
            backgroundColor={'transparent'}
            paddingLeft={16}
            absolute
          />
          <View style={{ marginTop: 24 }}>
            <Text style={{ color: '#60a5fa' }}>Protein: {totalProtein.toFixed(1)}g ({percent(totalProtein)}%)</Text>
            <Text style={{ color: '#f87171' }}>Fat: {totalFat.toFixed(1)}g ({percent(totalFat)}%)</Text>
            <Text style={{ color: '#facc15' }}>Carbs: {totalCarbs.toFixed(1)}g ({percent(totalCarbs)}%)</Text>
          </View>
        </>
      ) : (
        <Text>No food data available to display the chart.</Text>
      )}
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
          name="Calendar"
          component={CalendarScreen}
          options={{ title: 'Calendar' }}
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