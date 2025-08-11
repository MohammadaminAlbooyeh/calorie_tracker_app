import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useFood } from './FoodContext';

export default function BreakfastScreen() {
  const { addFood } = useFood();

  const [foodName, setFoodName] = useState('');
  const [itemNumber, setItemNumber] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleAddFood = () => {
    if (!foodName.trim()) {
      Alert.alert('Error', 'Please enter the food name.');
      return;
    }
    if (!itemNumber.trim()) {
      Alert.alert('Error', 'Please enter the item number.');
      return;
    }
    if (!quantity.trim()) {
      Alert.alert('Error', 'Please enter the quantity.');
      return;
    }

    const newFood = {
      name: foodName.trim(),
      quantity: Number(itemNumber),
      weight: Number(quantity),
      calories: 0,  // default empty, can update later
      protein: 0,
      carbs: 0,
      fat: 0,
    };

    addFood(newFood);

    // Clear inputs
    setFoodName('');
    setItemNumber('');
    setQuantity('');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Add Breakfast Food</Text>

      <TextInput
        style={styles.input}
        placeholder="Food Name"
        value={foodName}
        onChangeText={setFoodName}
      />

      <TextInput
        style={styles.input}
        placeholder="Item Number"
        keyboardType="numeric"
        value={itemNumber}
        onChangeText={setItemNumber}
      />

      <TextInput
        style={styles.input}
        placeholder="Quantity (grams)"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddFood}>
        <Text style={styles.buttonText}>Add Food</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f8f8ff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#388e3c',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
