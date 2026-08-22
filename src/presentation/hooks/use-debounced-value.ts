import { useEffect, useState } from 'react';

/**
 * Devuelve `value` solo después de que pase `delayMs` sin que vuelva a
 * cambiar — cada cambio reinicia la espera, así que una ráfaga de cambios
 * seguidos produce un único valor final en vez de uno por cambio.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
