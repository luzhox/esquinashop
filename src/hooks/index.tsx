import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAsyncStorage = (
  key: string,
  initialValue?: string,
): [string | undefined, (val: string) => void, boolean] => {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const getStoredItem = async (
    keyStore: string,
    initialValueStore?: string,
  ) => {
    try {
      const item = await AsyncStorage.getItem(keyStore);
      const value = item ? JSON.parse(item) : initialValueStore;
      setStoredValue(value);
      await setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStoredItem(key, initialValue);
  }, [key, initialValue]);

  const setValue = async (value: string) => {
    try {
      setStoredValue(value);
      await AsyncStorage.setItem(key, JSON.stringify(value));
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  return [storedValue, setValue, loading];
};

export default useAsyncStorage;
