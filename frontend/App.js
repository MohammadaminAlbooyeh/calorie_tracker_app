
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CalorieTracker from './CalorieTracker';
import FoodLog from './FoodLog';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="CalorieTracker">
                <Stack.Screen name="CalorieTracker" component={CalorieTracker} options={{ title: 'Calorie Tracker' }} />
                <Stack.Screen name="FoodLog" component={FoodLog} options={{ title: 'Food Log' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}