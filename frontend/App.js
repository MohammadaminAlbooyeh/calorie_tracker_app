import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import CalorieTracker from './CalorieTracker';

const App = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <CalorieTracker />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
    }
});

export default App;