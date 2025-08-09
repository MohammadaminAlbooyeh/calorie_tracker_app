import React from 'react';
import { StyleSheet, Text, Dimensions, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Calendar } from 'react-native-calendars';

const data = {
  labels: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  datasets: [
    {
      data: [1800, 2000, 1500, 2200, 1700, 2100, 1900], // Sample calories per day
    },
  ],
};

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(56, 142, 60, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  barPercentage: 0.6,
  decimalPlaces: 0,
};


const FoodLog = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Weekly Calorie Intake</Text>
      <BarChart
        data={data}
        width={Dimensions.get('window').width - 32}
        height={260}
        chartConfig={chartConfig}
        style={{ borderRadius: 16, marginBottom: 24 }}
        fromZero
        showValuesOnTopOfBars
      />
      <Calendar
        style={styles.calendar}
        onDayPress={day => {
          // اینجا می‌تونی با انتخاب روز، اطلاعات غذا را نمایش بدهی
          console.log('selected day', day);
        }}
      />
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#388e3c',
  },
  calendar: {
    width: '90%',
    borderRadius: 16,
    elevation: 2,
    marginBottom: 24,
  },
});

export default FoodLog;
