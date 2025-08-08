import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-paper'; // Keeping this import as it was in the original code, although not used here.
import axios from 'axios';
import Svg, { Circle, Text as TextSVG } from 'react-native-svg';

// IMPORTANT: Replace with your actual backend URL.
// If running on Expo Go, this must be your local network IP (e.g., http://192.168.1.100:8000).
const API_BASE_URL = 'http://172.20.10.2:8000';

// Mocking the API call for demonstration purposes in this environment.
// In a real app, you would use axios.
const mockApiCall = (foodName, quantity) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (foodName.toLowerCase() === 'error') {
                reject({ message: 'A mock error occurred.' });
            } else {
                resolve({
                    food: {
                        food_name: foodName,
                        quantity: parseFloat(quantity) || 1,
                        protein: Math.floor(Math.random() * 50) + 10,
                        carbs: Math.floor(Math.random() * 60) + 20,
                        fat: Math.floor(Math.random() * 30) + 5,
                        calories: Math.floor(Math.random() * 500) + 50,
                    }
                });
            }
        }, 1000);
    });
};

// Replace local image paths with publicly accessible URLs for demonstration.
// In your real project, you can use local assets like 'require("./assets/...")'
const mealIcons = {
    breakfast: 'https://placehold.co/48x48/F4D35E/ffffff?text=B',
    lunch: 'https://placehold.co/48x48/EE9B00/ffffff?text=L',
    salad: 'https://placehold.co/48x48/94D2BD/ffffff?text=S',
    dinner: 'https://placehold.co/48x48/005F73/ffffff?text=D',
};

// MealCard component for each meal
const MealCard = ({ icon, title, calories }) => (
    <View style={styles.mealCard}>
        <View style={styles.mealIconContainer}>
            <Image source={{ uri: icon }} style={styles.mealIcon} />
        </View>
        <View style={styles.mealInfo}>
            <Text style={styles.mealTitle}>{title}</Text>
            <Text style={styles.mealCalories}>{calories}</Text>
        </View>
        <TouchableOpacity style={styles.mealAddButton}>
            <Text style={styles.mealAddButtonText}>+ Add</Text>
        </TouchableOpacity>
    </View>
);

const CalorieTracker = () => {
    const [entries, setEntries] = useState([]);
    const [totalCalories, setTotalCalories] = useState(0);
    const [foodName, setFoodName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);
    const calorieGoal = 2000;

    const handleAddFood = async () => {
        if (!foodName.trim()) {
            setMessage('Please enter a food name.');
            setIsError(true);
            return;
        }
        setIsLoading(true);
        setMessage(null);

        const qty = parseFloat(quantity) || 1;

        try {
            // Uncomment the real API call and comment out the mock one when ready
            /*
            const response = await axios.post(`${API_BASE_URL}/add_food_with_nutrition/`, null, {
                params: { food_name: foodName, quantity: qty }
            });
            const food = response.data.food;
            */
            const response = await mockApiCall(foodName, qty);
            const food = response.food;

            setEntries([...entries, {
                name: food.food_name,
                quantity: food.quantity,
                protein: food.protein,
                carbs: food.carbs,
                fat: food.fat,
            }]);
            setTotalCalories(prev => Math.min(prev + (food.calories || 0), calorieGoal));
            setFoodName("");
            setQuantity("");
            setMessage('Food added successfully!');
            setIsError(false);
        } catch (error) {
            console.error('Error:', error);
            setMessage(error.message || 'An unexpected error occurred.');
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate total macros from entries
    const totalProtein = entries.reduce((sum, e) => sum + (e.protein || 0) * (e.quantity || 1), 0);
    const totalCarbs = entries.reduce((sum, e) => sum + (e.carbs || 0) * (e.quantity || 1), 0);
    const totalFat = entries.reduce((sum, e) => sum + (e.fat || 0) * (e.quantity || 1), 0);
    const progressPercent = Math.min(totalCalories / calorieGoal, 1);

    return (
        <View style={styles.safeAreaContainer}>
            <View style={styles.container}>
                {/* Header section */}
                <View style={styles.headerContainer}>
                    <Text style={styles.appTitle}>
                        Cal
                        <Text style={{ color: '#4caf50' }}>o</Text>
                        track
                    </Text>
                    <Text style={styles.subtitle}>Let's crush your goals today!</Text>
                </View>

                {/* Top bar for date selection and icons */}
                <View style={styles.topBar}>
                    <Text style={styles.dateText}>Today</Text>
                    {/* Add icons for edit and calendar here later */}
                </View>

                {/* Green card for daily intake and macros */}
                <View style={styles.intakeCard}>
                    <View style={styles.intakeRow}>
                        <View style={styles.intakeLeft}>
                            <Text style={styles.intakeLabel}>Daily intake</Text>
                            <Text style={styles.intakePercent}>
                                {`${(progressPercent * 100).toFixed(1)}%`}
                            </Text>
                        </View>
                        <View style={styles.intakeRight}>
                            <Svg width={110} height={110}>
                                <Circle
                                    cx={55}
                                    cy={55}
                                    r={48}
                                    stroke="#e0e0e0"
                                    strokeWidth={12}
                                    fill="none"
                                />
                                <Circle
                                    cx={55}
                                    cy={55}
                                    r={48}
                                    stroke="#4caf50"
                                    strokeWidth={12}
                                    fill="none"
                                    strokeDasharray={2 * Math.PI * 48}
                                    strokeDashoffset={2 * Math.PI * 48 * (1 - progressPercent)}
                                    rotation={-90}
                                    originX={55}
                                    originY={55}
                                />
                                <TextSVG
                                    x={55}
                                    y={62}
                                    fontSize="22"
                                    fill="#333"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                >
                                    {`${totalCalories}`}
                                </TextSVG>
                                <TextSVG
                                    x={55}
                                    y={78}
                                    fontSize="12"
                                    fill="#888"
                                    textAnchor="middle"
                                >
                                    {`/ ${calorieGoal} kcal`}
                                </TextSVG>
                            </Svg>
                        </View>
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

                {/* Message display for errors and success */}
                {message && (
                    <View style={[styles.messageContainer, isError ? styles.errorBackground : styles.successBackground]}>
                        <MaterialCommunityIcons 
                            name={isError ? 'alert-circle-outline' : 'check-circle-outline'}
                            size={20}
                            color={isError ? '#D32F2F' : '#388e3c'}
                        />
                        <Text style={[styles.messageText, isError ? styles.errorText : styles.successText]}>{message}</Text>
                    </View>
                )}

                {/* Add Food Form */}
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Food Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter food name"
                        value={foodName}
                        onChangeText={setFoodName}
                        placeholderTextColor="#aaa"
                    />
                    <Text style={styles.label}>Quantity (g)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter quantity in grams"
                        value={quantity}
                        onChangeText={setQuantity}
                        keyboardType="numeric"
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

                {/* Meal cards section */}
                <Text style={styles.sectionTitle}>My Meals</Text>
                <View style={styles.mealSection}>
                    <MealCard
                        icon={mealIcons.breakfast}
                        title="Breakfast"
                        calories="Recommended 830-1170 cal"
                    />
                    <MealCard
                        icon={mealIcons.lunch}
                        title="Lunch"
                        calories="Recommended 830-1170 cal"
                    />
                    <MealCard
                        icon={mealIcons.salad}
                        title="Snack"
                        calories="Recommended 830-1170 cal"
                    />
                    <MealCard
                        icon={mealIcons.dinner}
                        title="Dinner"
                        calories="Recommended 830-1170 cal"
                    />
                </View>

                {/* Recently Logged section */}
                <Text style={styles.sectionTitle}>Recently Logged</Text>
                <View style={styles.recentSection}>
                    {entries.length === 0 ? (
                        <Text style={styles.recentEmpty}>No foods added yet.</Text>
                    ) : (
                        entries.map((entry, idx) => (
                            <View key={idx} style={styles.recentItemContainer}>
                                <Text style={styles.recentItemName}>{entry.name}</Text>
                                <View style={styles.recentItemMacros}>
                                    <Text style={styles.macroText}>P:{entry.protein}</Text>
                                    <Text style={styles.macroText}>C:{entry.carbs}</Text>
                                    <Text style={styles.macroText}>F:{entry.fat}</Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </View>

            {/* Bottom navigation bar */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialCommunityIcons name="robot" size={24} color="#888" />
                    <Text style={styles.navLabel}>Ask AI</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialCommunityIcons name="barcode-scan" size={24} color="#888" />
                    <Text style={styles.navLabel}>Scan</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
                    <MaterialCommunityIcons name="home" size={24} color="#4caf50" />
                    <Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialCommunityIcons name="bullseye-arrow" size={24} color="#888" />
                    <Text style={styles.navLabel}>Goals</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialCommunityIcons name="food" size={24} color="#888" />
                    <Text style={styles.navLabel}>Food log</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
        backgroundColor: '#f8f8ff',
    },
    container: {
        flex: 1,
        paddingBottom: 70, // To prevent content from being hidden by the bottom nav
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
        backgroundColor: '#d6f5d6',
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
    intakeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    intakeLeft: {
        flex: 1,
        justifyContent: 'center',
    },
    intakeRight: {
        width: 110,
        height: 110,
        alignItems: 'center',
        justifyContent: 'center',
    },
    intakeLabel: {
        fontSize: 16,
        color: '#388e3c',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    intakePercent: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#388e3c',
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
        marginLeft: 16,
        marginTop: 12,
        marginBottom: 8,
    },
    mealSection: {
        paddingHorizontal: 8,
    },
    mealCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        marginVertical: 6,
        marginHorizontal: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 1,
    },
    mealIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#f8f8ff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    mealIcon: {
        width: 32,
        height: 32,
        resizeMode: 'contain',
    },
    mealInfo: {
        flex: 1,
    },
    mealTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#222',
    },
    mealCalories: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    mealAddButton: {
        backgroundColor: '#4caf50',
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mealAddButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    recentSection: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    recentEmpty: {
        color: '#888',
        fontSize: 14,
        marginTop: 4,
    },
    recentItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        marginVertical: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    recentItemName: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
    recentItemMacros: {
        flexDirection: 'row',
        gap: 8,
    },
    macroText: {
        backgroundColor: '#e0f2f1',
        color: '#00796b',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 'bold',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingVertical: 8,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 8,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
    },
    navItemActive: {
        borderTopWidth: 2,
        borderTopColor: '#4caf50',
    },
    navLabel: {
        fontSize: 11,
        color: '#888',
        marginTop: 2,
    },
    navLabelActive: {
        color: '#4caf50',
        fontWeight: 'bold',
    },
});

export default CalorieTracker;

