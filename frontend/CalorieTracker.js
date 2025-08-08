import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import Svg, { Circle, Text as TextSVG } from 'react-native-svg';

// IMPORTANT: Replace with your actual backend URL.
// If running on Expo Go, this must be your local network IP (e.g., http://192.168.1.100:8000).
const API_BASE_URL = 'http://172.20.10.2:8000';

// A simple in-app database for common foods to provide more realistic data.
const foodDatabase = {
    'apple': {
        baseCaloriesPer100g: 52, // calories per 100g
        baseWeight: 182, // typical weight of a medium apple in grams
        proteinPer100g: 0.3,
        carbsPer100g: 13.8,
        fatPer100g: 0.2,
    },
    'banana': {
        baseCaloriesPer100g: 89,
        baseWeight: 118,
        proteinPer100g: 1.1,
        carbsPer100g: 22.8,
        fatPer100g: 0.3,
    },
    'egg': {
        baseCaloriesPer100g: 155,
        baseWeight: 50,
        proteinPer100g: 13,
        carbsPer100g: 1.1,
        fatPer100g: 11,
    },
    'chicken breast': {
        baseCaloriesPer100g: 165,
        baseWeight: 100,
        proteinPer100g: 31,
        carbsPer100g: 0,
        fatPer100g: 3.6,
    }
};

// Mocking the API call for demonstration purposes.
const mockApiCall = (foodName, quantity, weight) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const normalizedFoodName = foodName.toLowerCase().trim();
            const foodData = foodDatabase[normalizedFoodName];

            let finalWeight = parseFloat(weight) || 0;
            let calories, protein, carbs, fat;

            if (foodData) {
                // If a weight is provided, use it for calculation
                if (finalWeight > 0) {
                    calories = Math.floor((finalWeight / 100) * foodData.baseCaloriesPer100g);
                    protein = Math.floor((finalWeight / 100) * foodData.proteinPer100g);
                    carbs = Math.floor((finalWeight / 100) * foodData.carbsPer100g);
                    fat = Math.floor((finalWeight / 100) * foodData.fatPer100g);
                } else {
                    // If no weight, use a default base weight and quantity
                    finalWeight = foodData.baseWeight * quantity;
                    calories = Math.floor((finalWeight / 100) * foodData.baseCaloriesPer100g);
                    protein = Math.floor((finalWeight / 100) * foodData.proteinPer100g);
                    carbs = Math.floor((finalWeight / 100) * foodData.carbsPer100g);
                    fat = Math.floor((finalWeight / 100) * foodData.fatPer100g);
                }
            } else {
                // Fallback to random data for unknown foods
                const baseCaloriesPer100g = Math.floor(Math.random() * 500) + 50;
                const baseCaloriesPerItem = Math.floor(Math.random() * 150) + 20;

                if (finalWeight > 0) {
                    calories = Math.floor((finalWeight / 100) * baseCaloriesPer100g);
                } else {
                    calories = Math.floor(quantity * baseCaloriesPerItem);
                }
                
                protein = Math.floor(Math.random() * 50) + 10;
                carbs = Math.floor(Math.random() * 60) + 20;
                fat = Math.floor(Math.random() * 30) + 5;
            }

            resolve({
                food: {
                    food_name: foodName,
                    quantity: parseFloat(quantity) || 1,
                    weight: finalWeight,
                    protein: protein,
                    carbs: carbs,
                    fat: fat,
                    calories: calories,
                }
            });
        }, 1000);
    });
};

const CalorieTracker = () => {
    const [entries, setEntries] = useState([]);
    const [foodName, setFoodName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [weight, setWeight] = useState("");
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
        const wght = parseFloat(weight) || 0;

        try {
            const response = await mockApiCall(foodName, qty, wght);
            const food = response.food;

            setEntries(prevEntries => [
                ...prevEntries,
                {
                    name: food.food_name,
                    quantity: food.quantity,
                    weight: food.weight,
                    protein: food.protein,
                    carbs: food.carbs,
                    fat: food.fat,
                    calories: food.calories,
                },
            ]);
            setFoodName("");
            setQuantity("");
            setWeight("");
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
                        <Text style={styles.appTitle}>
                            Cal<Text style={{ color: '#4caf50' }}>o</Text>track
                        </Text>
                        <Text style={styles.subtitle}>Let's crush your goals today!</Text>
                    </View>
                    <View style={styles.topBar}>
                        <Text style={styles.dateText}>Today</Text>
                    </View>
                    <View style={styles.intakeCard}>
                        <View style={styles.intakeRow}>
                            <View style={styles.intakeLeft}>
                                <Text style={styles.intakeLabel}>Daily intake</Text>
                                <Text style={styles.intakePercent}>{`${(progressPercent * 100).toFixed(1)}%`}</Text>
                            </View>
                            <View style={styles.intakeRight}>
                                <Svg width={110} height={110}>
                                    <Circle cx={55} cy={55} r={48} stroke="#e0e0e0" strokeWidth={12} fill="none" />
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
                                    <TextSVG x={55} y={62} fontSize="22" fill="#333" fontWeight="bold" textAnchor="middle">
                                        {`${totalCalories}`}
                                    </TextSVG>
                                    <TextSVG x={55} y={78} fontSize="12" fill="#888" textAnchor="middle">
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
                            onChangeText={(text) => {
                                const numericValue = text.replace(/[^0-9]/g, '');
                                setQuantity(numericValue);
                            }}
                            placeholderTextColor="#aaa"
                        />
                        <Text style={styles.label}>Weight (g)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter weight in grams"
                            keyboardType="numeric"
                            value={weight}
                            onChangeText={(text) => {
                                const numericValue = text.replace(/[^0-9.]/g, '');
                                setWeight(numericValue);
                            }}
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
                                    <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 0.1 }]}> </Text>
                                    <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 1.5, textAlign: 'left' }]}>Food</Text>
                                    <Text style={[styles.tableCell, styles.tableHeaderCell]}>Items</Text>
                                    <Text style={[styles.tableCell, styles.tableHeaderCell]}>Weight</Text>
                                    <Text style={[styles.tableCell, styles.tableHeaderCell]}>Calories</Text>
                                </View>
                                {entries.map((food, index) => (
                                    <View key={index} style={styles.tableRow}>
                                        <TouchableOpacity
                                            onPress={() => handleRemoveFood(index)}
                                            style={styles.deleteButton}
                                        >
                                            <MaterialCommunityIcons name="minus-circle" size={20} color="#D32F2F" />
                                        </TouchableOpacity>
                                        <Text style={[styles.tableCell, { flex: 1.5, textAlign: 'left' }]}>{food.name}</Text>
                                        <Text style={styles.tableCell}>{food.quantity}</Text>
                                        <Text style={styles.tableCell}>{food.weight > 0 ? `${food.weight} g` : '-'}</Text>
                                        <Text style={styles.tableCell}>{food.calories} kcal</Text>
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
        backgroundColor: '#f8f8ff',
    },
    scrollView: {
        marginBottom: 70, // To prevent content from being hidden by the bottom nav
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
        alignItems: 'center', // Add this to align items vertically
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
