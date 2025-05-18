import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { THEMES, DEFAULT_THEME } from "~/constants";

// Define the theme context type
interface ThemeContextType {
  currentTheme: string;
  toggleTheme: () => void;
}

// Create the theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider component
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState(DEFAULT_THEME);

  const themeData: ThemeContextType = {
    currentTheme,
    toggleTheme: () => {
      const next = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
      document.documentElement.setAttribute("data-theme", next);
      setCurrentTheme(next);
    },
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
  });

  return (
    <ThemeContext.Provider value={themeData}>{children}</ThemeContext.Provider>
  );
}

// Custom hook to use the theme context
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
