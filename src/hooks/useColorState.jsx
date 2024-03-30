// this is a custom hook to keep the state of the colors for thumbs up/down buttons even after logging out

import { useState, useEffect } from "react";

const useColorState = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};

export default useColorState;
