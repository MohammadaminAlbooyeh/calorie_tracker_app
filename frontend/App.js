import * as React from 'react';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initDB } from './db/initDB';
import CalorieTracker from './CalorieTracker';
import BreakfastScreen from './BreakfastScreen';
import LunchScreen from './LunchScreen';
import DinnerScreen from './DinnerScreen';
import SnacksOtherScreen from './SnacksOtherScreen';
import FoodLog from './FoodLog';
import WaterTrackerScreen from './WaterTrackerScreen';
import { FoodProvider } from './FoodContext';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    try {
      initDB && initDB();
      console.log('Database initialized');
    } catch (error) {
      console.error('Error initializing DB:', error);
    }
  }, []);

  return (
    <FoodProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="CalorieTracker">
          <Stack.Screen
            name="CalorieTracker"
            component={CalorieTracker}
            options={{ title: 'Calorie Tracker' }}
          />
          <Stack.Screen name="Breakfast" component={BreakfastScreen} />
          <Stack.Screen name="Lunch" component={LunchScreen} />
          <Stack.Screen name="Dinner" component={DinnerScreen} />
          <Stack.Screen name="SnacksOther" component={SnacksOtherScreen} />
          <Stack.Screen name="FoodLog" component={FoodLog} options={{ title: 'Food Log' }} />
          <Stack.Screen name="WaterTracker" component={WaterTrackerScreen} options={{ title: 'Water Tracker' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </FoodProvider>
  );
}
