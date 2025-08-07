import { registerRootComponent } from 'expo';
import App from './App'; // Import the App component from the App.js file

// This function registers the App component as the main component for the application.
// Expo automatically handles this, but it's good practice for clarity.
registerRootComponent(App);