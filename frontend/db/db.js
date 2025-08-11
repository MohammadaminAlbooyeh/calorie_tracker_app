import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

let db;
if (Platform.OS !== 'web') {
  db = SQLite.openDatabase('mydb.db');
} else {
  db = null;
}

export default db;
