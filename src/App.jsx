import { Outlet } from "react-router-dom";
import Nav from "./ui/Nav";
import { useTheme } from "./ui/Theme.jsx";

function App() {
  const { ThemeDark, ThemeToggle } = useTheme();

  return (
    <>
        <Nav
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
