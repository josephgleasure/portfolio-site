import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type WeatherMode = 'none' | 'rain' | 'snow';

interface WeatherContextValue {
  mode: WeatherMode;
  setMode: (next: WeatherMode) => void;
  toggle: (next: Exclude<WeatherMode, 'none'>) => void;
}

const WeatherContext = createContext<WeatherContextValue | null>(null);

const STORAGE_KEY = 'weatherMode';

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<WeatherMode>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === 'rain' || raw === 'snow' || raw === 'none') return raw;
    } catch {
      // ignore
    }
    return 'none';
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  }, [mode]);

  useEffect(() => {
    document.body.classList.toggle('weather-on', mode !== 'none');
    document.body.classList.toggle('weather-rain', mode === 'rain');
    document.body.classList.toggle('weather-snow', mode === 'snow');
  }, [mode]);

  const value = useMemo<WeatherContextValue>(() => {
    return {
      mode,
      setMode,
      toggle: (next) => setMode(prev => (prev === next ? 'none' : next)),
    };
  }, [mode]);

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
};

export function useWeather(): WeatherContextValue {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error('useWeather must be used within WeatherProvider');
  return ctx;
}

