export function initDB() {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS foods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        quantity INTEGER,
        weight INTEGER,
        calories INTEGER,
        date TEXT
      );`,
      [],
      () => console.log('foods table created or already exists'),
      (_, error) => {
        console.error('Error creating foods table:', error);
        return false;
      }
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS water (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount INTEGER,
        date TEXT
      );`,
      [],
      () => console.log('water table created or already exists'),
      (_, error) => {
        console.error('Error creating water table:', error);
        return false;
      }
    );
  });
}
