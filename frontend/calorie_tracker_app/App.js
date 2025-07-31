import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions, ScrollView, TextInput, Button, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

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
};

const foodIcons = {
  Apple: 'https://img.icons8.com/emoji/48/000000/red-apple.png',
  Banana: 'https://img.icons8.com/emoji/48/000000/banana-emoji.png',
  Egg: 'https://img.icons8.com/emoji/48/000000/cooked-egg-emoji.png',
  Bread: 'https://img.icons8.com/emoji/48/000000/bread-emoji.png',
  'Milk Low Fat': 'https://img.icons8.com/emoji/48/000000/glass-of-milk-emoji.png',
  Oatmeal: 'https://img.icons8.com/emoji/48/000000/bowl-with-spoon-emoji.png',
  Strawberries: 'https://img.icons8.com/emoji/48/000000/strawberry-emoji.png',
  'Hot Tea': 'https://img.icons8.com/emoji/48/000000/teacup-without-handle-emoji.png',
};

export default function App() {
  const [foods, setFoods] = useState([]);
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');

  // Pie chart sample data (static for now)
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

    if (!name || isNaN(qty) || qty <= 0) {
      setError('Please enter valid food and quantity.');
      return;
    }
    if (!foodCalories[name]) {
      setError('Food not found in database.');
      return;
    }
    const calories = foodCalories[name] * qty;
    setFoods([
      ...foods,
      {
        id: Date.now().toString(),
        name,
        quantity: qty,
        calories,
        icon: foodIcons[name],
      },
    ]);
    setFoodName('');
    setQuantity('');
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Calorie Tracker</Text>
      </View>
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
        <TouchableOpacity style={styles.addButton} onPress={handleAddFood}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
      <FlatList
        data={foods}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.foodRow}>
            <Image source={{ uri: item.icon }} style={styles.icon} />
            <Text style={styles.foodName}>{item.name} x{item.quantity}</Text>
            <Text style={styles.calories}>{item.calories} cals</Text>
          </View>
        )}
        style={{ width: '100%' }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#aaa', marginTop: 10 }}>No foods added yet.</Text>}
      />
      <View style={styles.totalsRow}>
        <Text style={styles.totalsLabel}>Day Totals</Text>
        <Text style={styles.totalsValue}>{totalCalories} cals</Text>
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