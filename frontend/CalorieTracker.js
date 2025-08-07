import React, { useState } from 'react';
import { View, Text, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

// Replace with your backend URL. If running on Expo Go, use your local network IP.
const API_BASE_URL = 'http://192.168.1.110:8000';

const CalorieTracker = () => {
    const [loading, setLoading] = useState(false);
    const [entries, setEntries] = useState([]);

    const fetchAllEntries = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/foods`);
            // Get the foods array from the response
            setEntries(response.data.foods || []);
            Alert.alert("Success", "All food entries have been fetched.");
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleError = (error) => {
        if (error.response) {
            // Server responded with an error status (e.g., 404, 500).
            console.error('Server Error:', error.response.data);
            Alert.alert('Server Error', error.response.data.detail || 'Something went wrong on the server.');
        } else if (error.request) {
            // No response was received (e.g., network error, server is down).
            console.error('Network Error:', error.request);
            Alert.alert('Network Error', 'Could not connect to the server. Please check your internet connection and that the backend is running.');
        } else {
            // An error occurred during the request setup.
            console.error('Unknown Error:', error.message);
            Alert.alert('Unknown Error', 'An unexpected error occurred.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Calorie Tracker</Text>
            <Button title="Fetch All Entries" onPress={fetchAllEntries} disabled={loading} />
            {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}

            {entries.length > 0 && (
                <View style={styles.listContainer}>
                    {entries.map((entry, index) => (
                        <Text key={index} style={styles.listItem}>
                            {entry.name}: {entry.calories} calories (Protein: {entry.protein}g, Fat: {entry.fat}g, Carbs: {entry.carbs}g)
                        </Text>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    loader: {
        marginTop: 20,
    },
    listContainer: {
        marginTop: 20,
        width: '100%',
        alignItems: 'flex-start',
    },
    listItem: {
        fontSize: 16,
        padding: 5,
    }
});

export default CalorieTracker;