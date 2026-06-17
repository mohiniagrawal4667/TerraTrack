// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../hooks/useLocalStorage';

describe('useLocalStorage Custom React State Hook', () => {
  const TEST_KEY = 'test_storage_key';

  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('initializes with the default value when no stored record exists', () => {
    const { result } = renderHook(() => useLocalStorage<string>(TEST_KEY, 'initial_text'));
    const [storedValue] = result.current;
    
    expect(storedValue).toBe('initial_text');
    expect(window.localStorage.getItem(TEST_KEY)).toBeNull();
  });

  it('initializes with existing value stored in localStorage', () => {
    window.localStorage.setItem(TEST_KEY, JSON.stringify('saved_preference'));
    
    const { result } = renderHook(() => useLocalStorage<string>(TEST_KEY, 'fallback_text'));
    const [storedValue] = result.current;
    
    expect(storedValue).toBe('saved_preference');
  });

  it('updates state value and syncs it with localStorage on setter invoke', () => {
    const { result } = renderHook(() => useLocalStorage<number>(TEST_KEY, 100));
    const [, setValue] = result.current;

    act(() => {
      setValue(250);
    });

    const [updatedValue] = result.current;
    expect(updatedValue).toBe(250);
    expect(JSON.parse(window.localStorage.getItem(TEST_KEY) || '')).toBe(250);
  });

  it('accepts functional setter updates', () => {
    const { result } = renderHook(() => useLocalStorage<number>(TEST_KEY, 40));
    const [, setValue] = result.current;

    act(() => {
      setValue((current) => current * 2);
    });

    const [updatedValue] = result.current;
    expect(updatedValue).toBe(80);
    expect(JSON.parse(window.localStorage.getItem(TEST_KEY) || '')).toBe(80);
  });

  it('reverts to default and logs warning if stored value does not parse correctly due to corruption', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    window.localStorage.setItem(TEST_KEY, 'invalid-non-json-string-{{{');

    const { result } = renderHook(() => useLocalStorage<{ name: string }>(TEST_KEY, { name: 'default' }));
    const [storedValue] = result.current;

    expect(storedValue).toEqual({ name: 'default' });
    expect(consoleWarnSpy).toHaveBeenCalled();
  });

  it('triggers robust array structure guard to revert to default if parsed is object but initialValue is array', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    // Store an object in local storage under the key
    window.localStorage.setItem(TEST_KEY, JSON.stringify({ item: 'not_an_array_record' }));

    // Requesting initialValue as an empty array []
    const { result } = renderHook(() => useLocalStorage<any[]>(TEST_KEY, []));
    const [storedValue] = result.current;

    expect(storedValue).toEqual([]);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('was corrupted or formatted incorrectly, reverting to default')
    );
  });
});
