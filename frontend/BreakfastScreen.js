import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useFood } from './FoodContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function BreakfastScreen() {
  const { entries, addFood, removeFood } = useFood();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [weight, setWeight] = useState('');

  const handleAddFood = () => {
    if (!name.trim()) {
      alert('Please enter food name');
      return;
    }
    if (!weight.trim() || isNaN(weight) || Number(weight) <= 0) {
      alert('Please enter a valid quantity (weight in grams)');
      return;
    }

    const foodItem = {
      name: name.trim(),
      quantity: quantity.trim() && !isNaN(quantity) && Number(quantity) > 0 ? Number(quantity) : null,
      weight: Number(weight),
    };

    addFood(foodItem);
    setName('');
    setQuantity('');
    setWeight('');
  };

  const handleRemoveFood = (index) => {
    removeFood(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Breakfast</Text>

        <TextInput
          style={styles.input}
          placeholder="Food Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Item Number (optional)"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Quantity (grams)"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={handleAddFood}>
          <Text style={styles.buttonText}>Add Food</Text>
        </TouchableOpacity>

        {/* Table of added foods */}
        <View style={styles.tableContainer}>
          <Text style={styles.tableHeader}>Added Foods</Text>
          {entries.length === 0 ? (
            <Text style={styles.noDataText}>No foods added yet.</Text>
          ) : (
            <View>
              <View style={[styles.tableRow, styles.tableHeaderRow]}>
                <Text style={[styles.tableCell, { flex: 2, textAlign: 'left' }]}>Food Name</Text>
                <Text style={styles.tableCell}>Items</Text>
                <Text style={styles.tableCell}>Quantity (g)</Text>
                <Text style={[styles.tableCell, { flex: 0.5 }]}>Remove</Text>
              </View>

              {entries.map((food, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 2, textAlign: 'left' }]}>{food.name}</Text>
                  <Text style={styles.tableCell}>{food.quantity !== null ? food.quantity : '-'}</Text>
                  <Text style={styles.tableCell}>{food.weight}</Text>
                  <TouchableOpacity onPress={() => handleRemoveFood(index)} style={styles.deleteButton}>
                    <MaterialCommunityIcons name="minus-circle" size={24} color="#D32F2F" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8ff',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#388e3c',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  tableHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableCell: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  deleteButton: {
    flex: 0.5,
    alignItems: 'center',
  },
  noDataText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
});
