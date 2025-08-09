import React, { createContext, useContext, useState } from 'react';

const FoodContext = createContext();

export function FoodProvider({ children }) {
  const [entries, setEntries] = useState([]);

  const addFood = (food) => {
    setEntries(prev => [...prev, food]);
  };

  const removeFood = (indexToRemove) => {
    setEntries(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <FoodContext.Provider value={{ entries, addFood, removeFood }}>
      {children}
    </FoodContext.Provider>
  );
}

export function useFood() {
  return useContext(FoodContext);
}
