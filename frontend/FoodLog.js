import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

function FoodLog() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food Log</Text>
      <Calendar
        style={styles.calendar}
        onDayPress={day => {
          // اینجا می‌تونی با انتخاب روز، اطلاعات غذا را نمایش بدهی
          console.log('selected day', day);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  calendar: {
    width: '90%',
    borderRadius: 16,
    elevation: 2,
    marginBottom: 24,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#388e3c',
    marginBottom: 16,
  },
});

export default FoodLog;
