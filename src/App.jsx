import { Outlet, useLocation } from "react-router-dom";
import Nav from "./ui/Nav";
import { useTheme } from "./ui/Theme.jsx";

function App() {
  const pathname = useLocation().pathname;
  const { ThemeDark, ThemeToggle } = useTheme();

  return (
    <>
        <Nav
          pathname={pathname}
          ThemeDark={ThemeDark}
          ThemeToggle={ThemeToggle}
        />
        <main
          className={`${ThemeDark && "dark"} bg-main dark:bg-main-dark overflow-hidden`}
        >
          <Outlet />
        </main>
    </>
  );
}

export default App;
