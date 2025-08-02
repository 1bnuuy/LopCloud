import { Outlet, useLocation } from "react-router-dom";
import Nav from "./ui/Nav";
import { useState } from "react";

function App() {
  // Nav.jsx
  const pathname = useLocation().pathname;
  const [ThemeDark, setTheme] = useState(false);

  const ThemeToggle = () => {
    setTheme(!ThemeDark);
  };

  return (
    <>
      <Nav
        pathname={pathname}
        ThemeDark={ThemeDark}
        ThemeToggle={ThemeToggle}
      />

      <main className={`${ThemeDark ? "dark" : ""} bg-main dark:bg-main-dark overflow-hidden`}>
        <Outlet />
      </main>
    </>
  );
}

export default App;
