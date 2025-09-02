import { createContext, useContext, useState, useEffect } from "react";

const Theme = createContext();
export const useTheme = () => useContext(Theme);

export const btnVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

export default function ThemeProvider({ children }) {
  const [ThemeDark, setTheme] = useState(
    localStorage.getItem("theme") === "light", //initial theme
  );

  const ThemeToggle = () => {
    const newTheme = !ThemeDark;
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme ? "light" : "dark");
  };

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "theme") {
        setTheme(e.newValue === "dark");
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <Theme.Provider value={{ ThemeDark, ThemeToggle }}>
      {children}
    </Theme.Provider>
  );
}
