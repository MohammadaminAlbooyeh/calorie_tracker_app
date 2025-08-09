import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function WaterTrackerScreen() {
  const [water, setWater] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [entries, setEntries] = useState([]);

  const handleAddWater = () => {
    if (!water.trim()) {
      setMessage('Please enter water amount.');
      setIsError(true);
      return;
    }
    setIsLoading(true);
    setMessage(null);
    setTimeout(() => {
      setEntries(prevEntries => [
        ...prevEntries,
        {
          amount: water,
        },
      ]);
      setWater("");
      setMessage('Water added successfully!');
      setIsError(false);
      setIsLoading(false);
    }, 700);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Water Tracker</Text>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Water (ml)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter water in ml"
          keyboardType="numeric"
          value={water}
          onChangeText={setWater}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddWater}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addButtonText}>Add Water</Text>
          )}
        </TouchableOpacity>
        {message ? (
          <Text style={[styles.message, isError ? styles.errorText : styles.successText]}>{message}</Text>
        ) : null}
      </View>
      <View style={styles.tableContainer}>
        <Text style={styles.tableHeader}>Added Water</Text>
        {entries.length > 0 ? (
          <View>
            <View style={[styles.tableRow, styles.tableHeaderRow]}>
              <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 1.5, textAlign: 'left' }]}>Amount (ml)</Text>
            </View>
            {entries.map((entry, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 1.5, textAlign: 'left' }]}>{entry.amount}</Text>
                <TouchableOpacity
                  onPress={() => setEntries(prev => prev.filter((_, i) => i !== index))}
                  style={styles.deleteButton}
                >
                  <MaterialCommunityIcons name="minus-circle" size={20} color="#D32F2F" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noDataText}>No water added yet.</Text>
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
