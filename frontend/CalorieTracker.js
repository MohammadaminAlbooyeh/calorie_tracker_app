import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFood } from './FoodContext';

const calorieGoal = 2000;

function CalorieTracker() {
  const navigation = useNavigation();
  const { entries, removeFood } = useFood();

  // total consume calorie
  const totalCalories = entries.reduce((sum, e) => sum + (e.calories || 0), 0);
  const totalProtein = entries.reduce((sum, e) => sum + (e.protein || 0), 0);
  const totalCarbs = entries.reduce((sum, e) => sum + (e.carbs || 0), 0);
  const totalFat = entries.reduce((sum, e) => sum + (e.fat || 0), 0);
  const progressPercent = Math.min(totalCalories / calorieGoal, 1);

  const handleRemoveFood = (indexToRemove) => {
    removeFood(indexToRemove);
  };

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
                  backgroundColor: `rgb(${Math.floor(144 + (progressPercent * 111))},${Math.floor(238 - (progressPercent * 238))},${Math.floor(144 - (progressPercent * 144))})`,
                }}
              />
              <Text style={styles.progressText}>
                {`${totalCalories} / ${calorieGoal} kcal`}
              </Text>
              <Text style={styles.progressTextRight}>
                {`${calorieGoal} cal`}
              </Text>
            </View>
            <View style={styles.intakeMacrosRow}>
              <View style={styles.intakeMacroItem}>
                <Text style={styles.intakeMacroLabel}>Carbs</Text>
                <Text style={styles.intakeMacroValue}>{entries.length === 0 ? '-' : `${totalCarbs} g`}</Text>
              </View>
              <View style={styles.intakeMacroItem}>
                <Text style={styles.intakeMacroLabel}>Proteins</Text>
                <Text style={styles.intakeMacroValue}>{entries.length === 0 ? '-' : `${totalProtein} g`}</Text>
              </View>
              <View style={styles.intakeMacroItem}>
                <Text style={styles.intakeMacroLabel}>Fats</Text>
                <Text style={styles.intakeMacroValue}>{entries.length === 0 ? '-' : `${totalFat} g`}</Text>
              </View>
            </View>
          </View>

          <View style={styles.mealBoxesContainer}>
            <TouchableOpacity style={styles.mealBox} onPress={() => navigation.navigate('Breakfast')}>
              <MaterialCommunityIcons name="food-croissant" size={24} color="#000" style={{ marginBottom: 4 }} />
              <Text style={styles.mealBoxText}>Breakfast</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mealBox} onPress={() => navigation.navigate('Lunch')}>
              <MaterialCommunityIcons name="food-fork-drink" size={24} color="#000" style={{ marginBottom: 4 }} />
              <Text style={styles.mealBoxText}>Lunch</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mealBox} onPress={() => navigation.navigate('Dinner')}>
              <MaterialCommunityIcons name="food-steak" size={24} color="#000" style={{ marginBottom: 4 }} />
              <Text style={styles.mealBoxText}>Dinner</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mealBox} onPress={() => navigation.navigate('SnacksOther')}>
              <MaterialCommunityIcons name="food-apple" size={24} color="#000" style={{ marginBottom: 4 }} />
              <Text style={styles.mealBoxText}>Snacks/Other</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mealBox} onPress={() => navigation.navigate('WaterTracker')}>
              <MaterialCommunityIcons name="cup-water" size={24} color="#000" style={{ marginBottom: 4 }} />
              <Text style={styles.mealBoxText}>Water Tracker</Text>
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
                    <Text style={styles.tableCell}>{food.calories}</Text>
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
    marginBottom: 32,
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
    position: 'absolute',
    left: 24,
    top: 8,
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
    zIndex: 1,
  },
  progressTextRight: {
    position: 'absolute',
    right: 16,
    top: 32,
    fontSize: 14,
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
  mealBoxesContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  mealBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginVertical: 6,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  mealBoxText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default CalorieTracker;