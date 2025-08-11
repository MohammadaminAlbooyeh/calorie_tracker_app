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

export default function SnacksOtherScreen() {
  const { addFood } = useFood();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [weight, setWeight] = useState('');

  const handleAddFood = () => {
    if (!name.trim()) {
      alert('Please enter food name');
      return;
    }
    if (!quantity.trim() || isNaN(quantity) || Number(quantity) <= 0) {
      alert('Please enter a valid item number');
      return;
    }
    if (!weight.trim() || isNaN(weight) || Number(weight) <= 0) {
      alert('Please enter a valid quantity (weight in grams)');
      return;
    }

    const foodItem = {
      name: name.trim(),
      quantity: Number(quantity),
      weight: Number(weight),
    };

    addFood(foodItem);
    setName('');
    setQuantity('');
    setWeight('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Snacks / Other</Text>

        <TextInput
          style={styles.input}
          placeholder="Food Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Item Number"
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
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
