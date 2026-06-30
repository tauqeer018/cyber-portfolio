import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Settings = {
  lowStim: boolean;
  setLowStim: (v: boolean) => void;
  reducedMotion: boolean;
};

const SettingsContext = createContext<Settings>({
  lowStim: false,
  setLowStim: () => {},
  reducedMotion: false,
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [lowStim, setLowStim] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <SettingsContext.Provider value={{ lowStim, setLowStim, reducedMotion }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
