import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function DailyConsumptionScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Daily Goal Section */}
      <View style={styles.goalSection}>
        <Text style={styles.goalLabel}>Your daily calorie goal</Text>
        <Text style={styles.goalValue}>1,750</Text>
      </View>

      {/* Macros Section */}
      <View style={styles.macrosSection}>
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Protein</Text>
          <Text style={styles.macroValue}>120</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Fat</Text>
          <Text style={styles.macroValue}>45</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Carbs</Text>
          <Text style={styles.macroValue}>200</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressSegment, { backgroundColor: '#ff6b35', flex: 1.2 }]} />
          <View style={[styles.progressSegment, { backgroundColor: '#22c55e', flex: 0.5 }]} />
          <View style={[styles.progressSegment, { backgroundColor: '#3b82f6', flex: 2 }]} />
        </View>
      </View>

      {/* Info Cards */}
      <View style={styles.cardsSection}>
        <View style={styles.infoCard}>
          <View style={[styles.cardIcon, { backgroundColor: '#ff4444' }]}>
            <Text style={styles.cardIconText}>📅</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Estimated achievement date</Text>
            <Text style={styles.cardValue}>May 14, 2024</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={[styles.cardIcon, { backgroundColor: '#3b82f6' }]}>
            <Text style={styles.cardIconText}>🔥</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Estimated Expenditure</Text>
            <Text style={styles.cardValue}>2,100 kcal</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={[styles.cardIcon, { backgroundColor: '#ff8c00' }]}>
            <Text style={styles.cardIconText}>🥩</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Target Protein</Text>
            <Text style={styles.cardValue}>0.75 g/lb</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={[styles.cardIcon, { backgroundColor: '#8b5cf6' }]}>
            <Text style={styles.cardIconText}>⚖️</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Diet Type</Text>
            <Text style={styles.cardValue}>Balanced</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  goalSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  goalLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  goalValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
  },
  macrosSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 20,
    marginBottom: 10,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  progressBarContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressSegment: {
    height: '100%',
  },
  cardsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardIconText: {
    fontSize: 18,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});
