import { Outlet, useLocation } from "react-router-dom";
import Nav from "./ui/Nav";
import { useTheme } from "./ui/Theme.jsx";
import { AnimatePresence, motion } from "motion/react";

function App() {
  const location = useLocation().pathname;
  const { ThemeDark, ThemeToggle } = useTheme();

  return (
    <>
      <Nav
        pathname={location}
        ThemeDark={ThemeDark}
        ThemeToggle={ThemeToggle}
      />
      
      <main
        className={`${ThemeDark && "dark"} bg-primary dark:bg-primary-dark overflow-hidden`}
      >
        <AnimatePresence mode="wait">
          <Outlet key={location} />
        </AnimatePresence>
      </main>
    </>
  );
}

export default App;
