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

  const updateFood = (indexToUpdate, updatedFood) => {
    setEntries(prev =>
      prev.map((item, idx) => (idx === indexToUpdate ? updatedFood : item))
    );
  };

  return (
    <FoodContext.Provider value={{ entries, addFood, removeFood, updateFood }}>
      {children}
    </FoodContext.Provider>
  );
}

export function useFood() {
  return useContext(FoodContext);
}
