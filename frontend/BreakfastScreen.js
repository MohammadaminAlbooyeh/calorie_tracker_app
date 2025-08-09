import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function BreakfastScreen() {
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [weight, setWeight] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [entries, setEntries] = useState([]);

  const handleRemoveFood = (indexToRemove) => {
    setEntries(prevEntries => prevEntries.filter((_, index) => index !== indexToRemove));
    setMessage('Food removed successfully!');
    setIsError(false);
  };

  const handleAddFood = () => {
    if (!foodName.trim()) {
      setMessage('Please enter a food name.');
      setIsError(true);
      return;
    }
    setIsLoading(true);
    setMessage(null);
    setTimeout(() => {
      setEntries(prevEntries => [
        ...prevEntries,
        {
          name: foodName,
          quantity: quantity,
          weight: weight,
        },
      ]);
      setFoodName("");
      setQuantity("");
      setWeight("");
      setMessage('Food added successfully!');
      setIsError(false);
      setIsLoading(false);
    }, 700);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Breakfast Page</Text>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Food Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter food name"
          value={foodName}
          onChangeText={setFoodName}
          placeholderTextColor="#aaa"
        />
        <Text style={styles.label}>Quantity (items)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 1, 2, 3"
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
          placeholderTextColor="#aaa"
        />
        <Text style={styles.label}>Weight (g)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter weight in grams"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddFood}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addButtonText}>Add Food</Text>
          )}
        </TouchableOpacity>
        {message ? (
          <Text style={[styles.message, isError ? styles.errorText : styles.successText]}>{message}</Text>
        ) : null}
      </View>
      <View style={styles.tableContainer}>
        <Text style={styles.tableHeader}>Added Foods</Text>
        {entries.length > 0 ? (
          <View>
            <View style={[styles.tableRow, styles.tableHeaderRow]}>
              <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 1.5, textAlign: 'left' }]}>Food</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell]}>Items</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell]}>Weight</Text>
            </View>
            {entries.map((food, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 1.5, textAlign: 'left' }]}>{food.name}</Text>
                <Text style={styles.tableCell}>{food.quantity}</Text>
                <Text style={styles.tableCell}>{food.weight ? `${food.weight} g` : '-'}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveFood(index)}
                  style={styles.deleteButton}
                >
                  <MaterialCommunityIcons name="minus-circle" size={20} color="#D32F2F" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noDataText}>No foods added yet.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 32,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  formContainer: {
    width: '90%',
    backgroundColor: '#f8f8ff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
    fontWeight: '600',
  },
  input: {
    height: 48,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    color: '#222',
  },
  addButton: {
    backgroundColor: '#4caf50',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  message: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  successText: {
    color: '#388e3c',
  },
  errorText: {
    color: '#D32F2F',
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  tableHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    color: '#555',
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  tableCell: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  noDataText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.2,
  },
});
