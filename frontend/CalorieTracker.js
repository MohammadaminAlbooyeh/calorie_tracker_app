import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFood } from './FoodContext';
import { getFoodNutrition } from './api'; // اگه داری این فایل رو
import { PieChart } from 'react-native-chart-kit';

const calorieGoal = 2000;

function Snackbar({ message, type, onDismiss }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss && onDismiss();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onDismiss]);
  if (!visible) return null;
  return (
    <View style={[styles.snackbar, type === 'error' ? styles.snackbarError : styles.snackbarSuccess]}>
      <Text style={styles.snackbarText}>{message}</Text>
    </View>
  );
}

function CalorieTracker() {
  const navigation = useNavigation();
  const { entries, updateFood, removeFood } = useFood();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ message: '', type: 'success', visible: false });

  // جمع کالری و ماکرونو ت محاسبه کن
  const totalCalories = entries.reduce((sum, e) => sum + (e.calories || 0), 0);
  const totalProtein = entries.reduce((sum, e) => sum + (e.protein || 0), 0);
  const totalCarbs = entries.reduce((sum, e) => sum + (e.carbs || 0), 0);
  const totalFat = entries.reduce((sum, e) => sum + (e.fat || 0), 0);
  const progressPercent = Math.min(totalCalories / calorieGoal, 1);

  // اگر غذایی فاقد اطلاعات تغذیه‌ای است، از api داده بگیر و اپدیت کن
  const fetchNutrition = async (food, index) => {
    try {
      const nutritionData = await getFoodNutrition(food.name);
      if (nutritionData && nutritionData.results && nutritionData.results.length > 0) {
        const info = nutritionData.results[0];
        const updatedFood = {
          ...food,
          calories: info.calories || food.calories,
          protein: info.protein || food.protein,
          carbs: info.carbs || food.carbs,
          fat: info.fat || food.fat,
        };
        updateFood(index, updatedFood);
      }
    } catch (error) {
      setSnackbar({ message: `Error fetching nutrition for ${food.name}`, type: 'error', visible: true });
      console.error("Error fetching nutrition for", food.name, error);
    }
  };

  useEffect(() => {
    async function updateNutritionInfo() {
      setLoading(true);
      for (let i = 0; i < entries.length; i++) {
        const food = entries[i];
        if (!food.calories || !food.protein || !food.carbs || !food.fat) {
          await fetchNutrition(food, i);
        }
      }
      setLoading(false);
    }
    updateNutritionInfo();
  }, [entries]);

  const handleRemoveFood = (indexToRemove) => {
    removeFood(indexToRemove);
    setSnackbar({ message: 'Food removed successfully.', type: 'success', visible: true });
  };

  const screenWidth = Dimensions.get('window').width;
  const macroPieData = [
    {
      name: 'Carbs',
      grams: totalCarbs,
      color: '#42a5f5',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: 'Protein',
      grams: totalProtein,
      color: '#66bb6a',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: 'Fat',
      grams: totalFat,
      color: '#ffa726',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
  ].filter(item => item.grams > 0);

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
                  backgroundColor: `rgb(${Math.floor(
                    144 + progressPercent * 111
                  )},${Math.floor(238 - progressPercent * 238)},${Math.floor(144 - progressPercent * 144)})`,
                }}
              />
              <Text style={styles.progressText}>
                {`${totalCalories} / ${calorieGoal} kcal`}
              </Text>
              <Text style={styles.progressTextRight}>{`${calorieGoal} cal`}</Text>
            </View>
            <View style={styles.intakeMacrosRow}>
              <View style={styles.intakeMacroItem}>
                <Text style={styles.intakeMacroLabel}>Carbs</Text>
                <Text style={styles.intakeMacroValue}>
                  {entries.length === 0 ? '-' : `${totalCarbs} g`}
                </Text>
              </View>
              <View style={styles.intakeMacroItem}>
                <Text style={styles.intakeMacroLabel}>Proteins</Text>
                <Text style={styles.intakeMacroValue}>
                  {entries.length === 0 ? '-' : `${totalProtein} g`}
                </Text>
              </View>
              <View style={styles.intakeMacroItem}>
                <Text style={styles.intakeMacroLabel}>Fats</Text>
                <Text style={styles.intakeMacroValue}>
                  {entries.length === 0 ? '-' : `${totalFat} g`}
                </Text>
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
            {loading && <ActivityIndicator size="large" color="#388e3c" />}
            {entries.length > 0 ? (
              <View>
                <View style={[styles.tableRow, styles.tableHeaderRow]}>
                  <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 1.5, textAlign: 'left' }]}>
                    Food
                  </Text>
                  <Text style={[styles.tableCell, styles.tableHeaderCell]}>Items</Text>
                  <Text style={[styles.tableCell, styles.tableHeaderCell]}>Weight</Text>
                  <Text style={[styles.tableCell, styles.tableHeaderCell]}>Calories</Text>
                  <Text style={[styles.tableCell, styles.tableHeaderCell]}>Protein</Text>
                  <Text style={[styles.tableCell, styles.tableHeaderCell]}>Carbs</Text>
                  <Text style={[styles.tableCell, styles.tableHeaderCell]}>Fat</Text>
                </View>
                {entries.map((food, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 1.5, textAlign: 'left' }]}>{food.name}</Text>
                    <Text style={styles.tableCell}>{food.quantity}</Text>
                    <Text style={styles.tableCell}>
                      {food.weight > 0 ? `${food.weight} g` : '-'}
                    </Text>
                    <Text style={styles.tableCell}>{food.calories ? food.calories : '-'}</Text>
                    <Text style={styles.tableCell}>{food.protein ? food.protein : '-'}</Text>
                    <Text style={styles.tableCell}>{food.carbs ? food.carbs : '-'}</Text>
                    <Text style={styles.tableCell}>{food.fat ? food.fat : '-'}</Text>
                    <TouchableOpacity onPress={() => handleRemoveFood(index)} style={styles.deleteButton}>
                      <MaterialCommunityIcons name="minus-circle" size={20} color="#D32F2F" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noDataText}>No foods added yet.</Text>
            )}
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8, color: '#333' }}>
              Macronutrient Breakdown
            </Text>
            {macroPieData.length > 0 ? (
              <PieChart
                data={macroPieData.map(item => ({
                  name: item.name,
                  population: item.grams,
                  color: item.color,
                  legendFontColor: item.legendFontColor,
                  legendFontSize: item.legendFontSize,
                }))}
                width={screenWidth - 40}
                height={180}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                  labelColor: () => '#333',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                }}
                accessor={'population'}
                backgroundColor={'transparent'}
                paddingLeft={'16'}
                absolute
              />
            ) : (
              <Text style={{ color: '#999', textAlign: 'center' }}>No macronutrient data yet.</Text>
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
      {snackbar.visible && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        />
      )}
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#388e3c',
    borderRadius: 20,
  },
  navButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  headerContainer: {
    marginBottom: 24,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
  },
  intakeCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },
  intakeLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 28,
    backgroundColor: '#e0e0e0',
    borderRadius: 14,
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  progressBar: {
    height: 28,
    borderRadius: 14,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  progressText: {
    position: 'absolute',
    left: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  progressTextRight: {
    position: 'absolute',
    right: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  intakeMacrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  intakeMacroItem: {
    alignItems: 'center',
  },
  intakeMacroLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  intakeMacroValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  mealBoxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  mealBox: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    elevation: 3,
  },
  mealBoxText: {
    fontWeight: '600',
    fontSize: 14,
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
    elevation: 3,
  },
  tableHeader: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 12,
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    position: 'relative',
  },
  tableHeaderRow: {
    borderBottomWidth: 2,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
  },
  tableHeaderCell: {
    fontWeight: '700',
    color: '#333',
  },
  deleteButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -10,
  },
  noDataText: {
    textAlign: 'center',
    paddingVertical: 20,
    color: '#999',
  },
  snackbar: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 40,
    padding: 16,
    borderRadius: 8,
    zIndex: 100,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  snackbarSuccess: {
    backgroundColor: '#43a047',
  },
  snackbarError: {
    backgroundColor: '#d32f2f',
  },
  snackbarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CalorieTracker;
