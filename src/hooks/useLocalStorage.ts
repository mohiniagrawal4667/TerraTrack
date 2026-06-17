/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook to manage reactive state backed by window.localStorage.
 * Type-safe, extremely defensive against corrupted JSON, and crash-proof.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Store initialValue in a ref to avoid recreating the readValue callback
  // when client-side renders pass reference-unstable values (e.g. empty arrays [] or object literals)
  const initialValueRef = useRef<T>(initialValue);

  useEffect(() => {
    initialValueRef.current = initialValue;
  }, [initialValue]);

  // Get initial value from local storage or fallback to provided initialValue
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValueRef.current;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (!item) {
        return initialValueRef.current;
      }
      
      const parsed = JSON.parse(item);
      
      // Robust array structure guard
      if (Array.isArray(initialValueRef.current) && !Array.isArray(parsed)) {
        console.warn(`Local storage key "${key}" was corrupted or formatted incorrectly, reverting to default.`);
        return initialValueRef.current;
      }
      
      return parsed as T;
    } catch (error) {
      console.warn(`Error reading or parsing localStorage key "${key}":`, error);
      return initialValueRef.current;
    }
  }, [key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a memorized setter function
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      setStoredValue((current) => {
        const newValue = value instanceof Function ? value(current) : value;
        window.localStorage.setItem(key, JSON.stringify(newValue));
        return newValue;
      });
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  useEffect(() => {
    setStoredValue(readValue());
  }, [key, readValue]);

  return [storedValue, setValue];
}

