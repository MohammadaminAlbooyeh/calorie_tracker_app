import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DailyConsumptionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Consumption</Text>
      {/* اطلاعات مصرف روزانه را اینجا نمایش بده */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 20,
  },
});
