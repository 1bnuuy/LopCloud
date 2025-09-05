import { useLocation, useOutlet } from "react-router-dom";
import Nav from "./ui/Nav";
import { useTheme } from "./ui/Theme.jsx";
import { AnimatePresence, motion } from "motion/react";

function App() {
  const location = useLocation().pathname;

  const availablePath = ["/", "/todolist", "/dictionary", "/bnuuyPanel/dictionary", "/contact"];
  const NoPage = !availablePath.includes(location);

  const page = useOutlet(); //useOutlet() finally fixed page transition, not <Outlet />
  const { ThemeDark, ThemeToggle } = useTheme();

  return (
    <>
      {!NoPage && (
        <Nav
          pathname={location}
          ThemeDark={ThemeDark}
          ThemeToggle={ThemeToggle}
        />
      )}

      <main
        className={`${ThemeDark && "dark"} bg-primary dark:bg-primary-dark`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {page && (
            <div key={location}>
              <motion.span
                key="1"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                exit={{ scaleX: 1 }}
                transition={{ duration: 0.4, ease: [0, 0.71, 0.2, 1.01] }}
                className="bg-accent dark:bg-accent-dark fixed top-0 z-50 h-[21vh] w-screen origin-left"
              />
              <motion.span
                key="2"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                exit={{ scaleX: 1 }}
                transition={{ duration: 0.4, delay: 0.1, ease: [0, 0.71, 0.2, 1.01] }}
                className="bg-accent dark:bg-accent-dark fixed top-[20vh] z-50 h-[21vh] w-screen origin-right"
              />
              <motion.span
                key="3"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                exit={{ scaleX: 1 }}
                transition={{ duration: 0.4, delay: 0.2, ease: [0, 0.71, 0.2, 1.01] }}
                className="bg-accent dark:bg-accent-dark fixed top-[40vh] z-50 h-[21vh] w-screen origin-left"
              />

              <motion.span
                key="4"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                exit={{ scaleX: 1 }}
                transition={{ duration: 0.4, delay: 0.3, ease: [0, 0.71, 0.2, 1.01] }}
                className="bg-accent dark:bg-accent-dark fixed top-[60vh] z-50 h-[21vh] w-screen origin-right"
              />

              <motion.span
                key="5"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                exit={{ scaleX: 1 }}
                transition={{ duration: 0.4, delay: 0.4, ease: [0, 0.71, 0.2, 1.01] }}
                className="bg-accent dark:bg-accent-dark fixed top-[80vh] z-50 h-[21vh] w-screen origin-left"
              />
              {page}
            </div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}

export default App;
