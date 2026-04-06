import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface AppState {
  selectedAlgorithm: string;
  setSelectedAlgorithm: (id: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("linear-regression");
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }, []);

  // Initialize dark mode
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, []);

  return (
    <AppContext.Provider
      value={{
        selectedAlgorithm,
        setSelectedAlgorithm,
        darkMode,
        toggleDarkMode,
        searchQuery,
        setSearchQuery,
        sidebarOpen,
        setSidebarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
