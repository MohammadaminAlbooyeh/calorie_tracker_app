
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CalorieTracker from './CalorieTracker';
import FoodLog from './FoodLog';
import BreakfastScreen from './BreakfastScreen';
import LunchScreen from './LunchScreen';
import DinnerScreen from './DinnerScreen';
import SnacksOtherScreen from './SnacksOtherScreen';
import WaterTrackerScreen from './WaterTrackerScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="CalorieTracker">
                <Stack.Screen name="CalorieTracker" component={CalorieTracker} options={{ title: 'Calorie Tracker' }} />
                <Stack.Screen name="Breakfast" component={BreakfastScreen} />
                <Stack.Screen name="Lunch" component={LunchScreen} />
                <Stack.Screen name="Dinner" component={DinnerScreen} />
                <Stack.Screen name="SnacksOther" component={SnacksOtherScreen} />
                <Stack.Screen name="WaterTracker" component={WaterTrackerScreen} />
                <Stack.Screen name="FoodLog" component={FoodLog} options={{ title: 'Food Log' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}