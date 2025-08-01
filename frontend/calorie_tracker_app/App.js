import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions, ScrollView, TextInput, Button, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { PieChart } from 'react-native-chart-kit';
import * as SQLite from 'expo-sqlite';
import { Calendar } from 'react-native-calendars';

// Food calorie database (per unit)
const foodCalories = {
  Apple: 52,
  Banana: 89,
  Egg: 78,
  Bread: 80,
  'Milk Low Fat': 51,
  Oatmeal: 81,
  Strawberries: 42,
  'Hot Tea': 2,
  Rice: 1.3, // per gram
};

const foodUnits = {
  Apple: 'item',
  Banana: 'item',
  Egg: 'item',
  Bread: 'item',
  'Milk Low Fat': 'ml',
  Oatmeal: 'g',
  Strawberries: 'g',
  'Hot Tea': 'ml',
  Rice: 'g',
};

// SQLite setup
const db = SQLite.openDatabase('foods.db');

// Create table if not exists
React.useEffect(() => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS foods (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, quantity INTEGER, unit TEXT, calories REAL, date TEXT);'
    );
  });
}, []);

export default function App() {
  const [foods, setFoods] = useState([]);
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  // Load foods for selected date
  React.useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM foods WHERE date = ?;',
        [selectedDate],
        (_, { rows }) => setFoods(rows._array)
      );
    });
  }, [selectedDate]);

  const carbs = 251, protein = 74, fat = 30;
  const macrosTotal = carbs + protein + fat;

  const totalCalories = foods.reduce((sum, item) => sum + item.calories, 0);

  const pieData = [
    { name: 'Carbs', population: carbs, color: '#22c55e', legendFontColor: '#333', legendFontSize: 15 },
    { name: 'Protein', population: protein, color: '#a78bfa', legendFontColor: '#333', legendFontSize: 15 },
    { name: 'Fat', population: fat, color: '#fbbf24', legendFontColor: '#333', legendFontSize: 15 },
  ];

  const handleAddFood = () => {
    setError('');
    const name = foodName.trim();
    const qty = parseInt(quantity);
    if (!name || isNaN(qty) || qty <= 0 || !unit) {
      setError('Please enter valid food, quantity, and unit.');
      return;
    }
    if (!foodCalories[name]) {
      setError('Food not found in database.');
      return;
    }
    const calories = foodCalories[name] * qty;
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO foods (name, quantity, unit, calories, date) VALUES (?, ?, ?, ?, ?);',
        [name, qty, unit, calories, selectedDate],
        (_, result) => {
          setFoods([...foods, { id: result.insertId, name, quantity: qty, unit, calories }]);
        }
      );
    });
    setFoodName('');
    setQuantity('');
    setUnit('');
  };

  // Set unit automatically when foodName changes
  React.useEffect(() => {
    if (foodName && foodUnits[foodName]) {
      setUnit(foodUnits[foodName]);
    } else {
      setUnit('');
    }
  }, [foodName]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Calorie Tracker</Text>
      </View>
      <Calendar
        onDayPress={day => setSelectedDate(day.dateString)}
        markedDates={{ [selectedDate]: { selected: true, selectedColor: '#22c55e' } }}
        style={{ margin: 10, borderRadius: 10 }}
      />
      <View style={styles.addBox}>
        <Text style={styles.addTitle}>Add Food</Text>
        <TextInput
          style={styles.input}
          placeholder="Food name (e.g. Apple)"
          value={foodName}
          onChangeText={setFoodName}
        />
        <TextInput
          style={styles.input}
          placeholder="Quantity"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />
        {/* Show unit as read-only text */}
        <View style={{marginBottom: 8}}>
          <Text style={{fontSize: 16, color: unit ? '#222' : '#aaa', padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, backgroundColor: '#f9f9f9'}}>
            {unit ? `Unit: ${unit}` : 'Unit will appear here'}
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddFood}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
      <FlatList
        data={foods}
        keyExtractor={item => item.id?.toString() || item.name}
        renderItem={({ item }) => (
          <View style={styles.foodRow}>
            <Text style={styles.foodName}>{item.name} x{item.quantity} {item.unit}</Text>
            <Text style={styles.calories}>{item.calories} cals</Text>
          </View>
        )}
        style={{ width: '100%' }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#aaa', marginTop: 10 }}>No foods added yet.</Text>}
      />
      <View style={styles.totalsRow}>
        <Text style={styles.totalsLabel}>Day Totals</Text>
        <Text style={styles.totalsValue}>{foods.reduce((sum, item) => sum + (item.calories || 0), 0)} cals</Text>
      </View>
      <View style={styles.chartRow}>
        <PieChart
          data={pieData}
          width={Dimensions.get('window').width * 0.45}
          height={120}
          chartConfig={{ color: () => '#333' }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="0"
          hasLegend={false}
          center={[0, 0]}
        />
        <View style={styles.macrosInfo}>
          <View style={styles.macrosPercentRow}>
            <Text style={[styles.macrosPercent, { color: '#22c55e' }]}>{Math.round((carbs / macrosTotal) * 100)}%</Text>
            <Text style={[styles.macrosPercent, { color: '#a78bfa' }]}>{Math.round((protein / macrosTotal) * 100)}%</Text>
            <Text style={[styles.macrosPercent, { color: '#fbbf24' }]}>{Math.round((fat / macrosTotal) * 100)}%</Text>
          </View>
          <View style={styles.macrosLabelRow}>
            <Text style={[styles.macrosLabel, { color: '#22c55e' }]}>Carbs</Text>
            <Text style={[styles.macrosLabel, { color: '#a78bfa' }]}>Protein</Text>
            <Text style={[styles.macrosLabel, { color: '#fbbf24' }]}>Fat</Text>
          </View>
          <View style={styles.macrosValueRow}>
            <Text style={[styles.macrosValue, { color: '#22c55e' }]}>{carbs} g</Text>
            <Text style={[styles.macrosValue, { color: '#a78bfa' }]}>{protein} g</Text>
            <Text style={[styles.macrosValue, { color: '#fbbf24' }]}>{fat} g</Text>
          </View>
        </View>
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
  icon: { width: 32, height: 32, marginRight: 16 },
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
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  macrosInfo: { flex: 1, marginLeft: 10 },
  macrosPercentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
    marginRight: 30,
  },
  macrosPercent: { fontSize: 16, fontWeight: 'bold' },
  macrosLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
    marginRight: 30,
  },
  macrosLabel: { fontSize: 15, fontWeight: 'bold' },
  macrosValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 30,
  },
  macrosValue: { fontSize: 15 },
});