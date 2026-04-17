import { useState, useEffect } from "react";

function getStorageValue(key, defaultValue) {
  const saved = localStorage.getItem(key);
  if (saved !== null) {
      try {
          return JSON.parse(saved);
      } catch (e) {
          console.error("Error parsing localStorage key", key, e);
          return defaultValue;
      }
  }
  return defaultValue;
}

export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
