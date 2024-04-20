import React from "react";

export const useLocalStorage = (storageKey: string, fallbackState: any) => {
  const [value, setValue] = React.useState(() => {
    let currentValue;

    try {
      currentValue = JSON.parse(
        localStorage.getItem(storageKey) || String(fallbackState)
      );
    } catch (error) {
      currentValue = fallbackState;
    }

    return currentValue;
  });

  React.useEffect(() => {
    localStorage.setItem(storageKey, value || null);
  }, [value]);

  return [value, setValue];
}
