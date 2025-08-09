import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const calorieGoal = 2000;

function CalorieTracker() {
  const navigation = useNavigation();
  const [entries, setEntries] = useState([]);
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [weight, setWeight] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleAddFood = () => {
    if (!foodName.trim()) {
      setMessage('Please enter a food name.');
      setIsError(true);
      return;
    }
    setIsLoading(true);
    setMessage(null);
    const qty = parseFloat(quantity) || 1;
    const wght = parseFloat(weight) || 0;
    const calories = Math.floor(qty * 100 + wght * 0.5);
    const protein = Math.floor(qty * 5);
    const carbs = Math.floor(qty * 10);
    const fat = Math.floor(qty * 2);
    setEntries(prevEntries => [
      ...prevEntries,
      {
        name: foodName,
        quantity: qty,
        weight: wght,
        protein,
        carbs,
        fat,
        calories,
      },
    ]);
    setFoodName("");
    setQuantity("");
    setWeight("");
    setMessage('Food added successfully!');
    setIsError(false);
    setIsLoading(false);
  };

  const handleRemoveFood = (indexToRemove) => {
    setEntries(prevEntries => prevEntries.filter((_, index) => index !== indexToRemove));
    setMessage('Food removed successfully!');
    setIsError(false);
  };

  const totalCalories = entries.reduce((sum, e) => sum + (e.calories || 0), 0);
  const totalProtein = entries.reduce((sum, e) => sum + (e.protein || 0), 0);
  const totalCarbs = entries.reduce((sum, e) => sum + (e.carbs || 0), 0);
  const totalFat = entries.reduce((sum, e) => sum + (e.fat || 0), 0);
  const progressPercent = Math.min(totalCalories / calorieGoal, 1);

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.appTitle}>Calorie Tracker</Text>
            <Text style={styles.subtitle}>Let's crush your goals today!</Text>
          </View>
          <View style={styles.topBar}>
            <Text style={styles.dateText}>Today</Text>
          </View>
          <View style={styles.intakeCard}>
            <Text style={styles.intakeLabel}>Daily intake</Text>
            <View style={styles.progressBarContainer}>
              <View
                style={{
                  ...styles.progressBar,
                  width: `${progressPercent * 100}%`,
                  backgroundColor: `rgb(${Math.floor(76 + (progressPercent * 179))},${Math.floor(175 - (progressPercent * 175))},${Math.floor(80 - (progressPercent * 80))})`,
                }}
              />
              <Text style={styles.progressText}>
                {`${(progressPercent * 100).toFixed(0)}%`}
              </Text>
              <Text style={styles.progressTextRight}>
                {`of a ${calorieGoal} cal diet`}
              </Text>
            </View>
            <View style={styles.intakeMacrosRow}>
              <View style={styles.intakeMacroItem}>
                <Text style={styles.intakeMacroLabel}>Carbs</Text>
                <Text style={styles.intakeMacroValue}>{totalCarbs} g</Text>
              </View>
              <View style={styles.intakeMacroItem}>
                <Text style={styles.intakeMacroLabel}>Proteins</Text>
                <Text style={styles.intakeMacroValue}>{totalProtein} g</Text>
              </View>
              <View style={styles.intakeMacroItem}>
                <Text style={styles.intakeMacroLabel}>Fats</Text>
                <Text style={styles.intakeMacroValue}>{totalFat} g</Text>
              </View>
            </View>
          </View>

          {message ? (
            <View style={[styles.messageContainer, isError ? styles.errorBackground : styles.successBackground]}>
              <MaterialCommunityIcons 
                name={isError ? 'alert-circle-outline' : 'check-circle-outline'}
                size={20}
                color={isError ? '#D32F2F' : '#388e3c'}
              />
              <Text style={[styles.messageText, isError ? styles.errorText : styles.successText]}>{message}</Text>
            </View>
          ) : null}

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
          </View>

          <View style={styles.tableContainer}>
            <Text style={styles.tableHeader}>Added Foods</Text>
            {entries.length > 0 ? (
              <View>
                <View style={[styles.tableRow, styles.tableHeaderRow]}>
                  <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 1.5, textAlign: 'left' }]}>Food</Text>
                  <Text style={[styles.tableCell, styles.tableHeaderCell]}>Items</Text>
                  <Text style={[styles.tableCell, styles.tableHeaderCell]}>Weight</Text>
                  <Text style={[styles.tableCell, styles.tableHeaderCell]}>Calories</Text>
                </View>
                {entries.map((food, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 1.5, textAlign: 'left' }]}>{food.name}</Text>
                    <Text style={styles.tableCell}>{food.quantity}</Text>
                    <Text style={styles.tableCell}>{food.weight > 0 ? `${food.weight} g` : '-'}</Text>
                    <Text style={styles.tableCell}>{food.calories} kcal</Text>
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
      </ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('CalorieTracker')}>
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('FoodLog')}>
          <Text style={styles.navButtonText}>Food Log</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  navButton: {
    backgroundColor: '#388e3c',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#f8f8ff',
  },
  scrollView: {
    marginBottom: 70,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  intakeCard: {
  backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  intakeLabel: {
    fontSize: 16,
    color: '#388e3c',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  progressBarContainer: {
    width: '100%',
    height: 48,
    backgroundColor: '#e0e0e0',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 16,
    marginTop: 8,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  progressBar: {
    height: 48,
    borderRadius: 24,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  progressText: {
    marginLeft: 24,
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
    zIndex: 1,
  },
  progressTextRight: {
    position: 'absolute',
    right: 16,
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    zIndex: 2,
  },
  intakeMacrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#b4e6b4',
    paddingTop: 12,
  },
  intakeMacroItem: {
    alignItems: 'center',
    flex: 1,
  },
  intakeMacroLabel: {
    fontSize: 14,
    color: '#388e3c',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  intakeMacroValue: {
    fontSize: 14,
    color: '#333',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  successBackground: {
    backgroundColor: '#e8f5e9',
  },
  errorBackground: {
    backgroundColor: '#ffebee',
  },
  messageText: {
    marginLeft: 8,
    fontSize: 14,
  },
  successText: {
    color: '#388e3c',
  },
  errorText: {
    color: '#D32F2F',
  },
  formContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
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
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
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

export default CalorieTracker;
