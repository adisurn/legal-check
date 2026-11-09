import { useEffect, useState } from "react";

export function useLocal<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });
  const [error, setError] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setError(false);
    } catch {
      setError(true);
    }
  }, [key, value]);
  return [value, setValue, error] as const;
}
