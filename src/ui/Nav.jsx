import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloud,
  faHouse,
  faListCheck,
  faBook,
  faMoon,
  faEnvelope,
  faAnglesDown,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

const links = [
  {
    name: "Home",
    icon: faHouse,
    path: "/",
  },

  {
    name: "Tasks",
    icon: faListCheck,
    path: "/todolist",
  },

  {
    name: "Wordbook",
    icon: faBook,
    path: "/dictionary",
  },

  {
    name: "Contact",
    icon: faEnvelope,
    path: "/contact",
  },
];

const nav = ({ ThemeDark, ThemeToggle }) => {
  const pathname = useLocation().pathname;
  const [NextPage, setNextPage] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1024px)");
    setIsMobile(mediaQuery.matches);

    const handler = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return (
    <>
      <nav
        className={`bg-secondary dark:bg-secondary-dark max-xs:gap-2 fixed left-4 z-50 flex h-18 w-11/12 items-start justify-between gap-5 rounded-md px-4 text-nowrap transition ease-in-out select-none max-lg:bottom-4 max-lg:left-1/2 max-lg:-translate-x-1/2 max-lg:items-center max-sm:justify-center lg:top-1/2 lg:h-11/12 lg:w-20 lg:-translate-y-1/2 lg:flex-col lg:justify-start lg:py-15 ${ThemeDark ? "dark" : ""}`}
      >
        <div className="max-xs:hidden relative flex items-center justify-center gap-6 max-sm:absolute max-sm:left-4">
          <FontAwesomeIcon
            icon={faCloud}
            className={`hover:ring-offset-secondary hover:ring-heading active:ring-heading dark:hover:ring-offset-secondary-dark dark:active:ring-offset-secondary-dark dark:hover:ring-heading-dark dark:active:ring-heading-dark text-primary dark:text-primary-dark bg-heading dark:bg-heading-dark cursor-pointer rounded-md px-[8.25px] py-3 text-2xl transition hover:ring-2 hover:ring-offset-3 active:ring-2 active:ring-offset-3`}
          />
        </div>

        <span className="bg-subtext dark:bg-subtext-dark hidden h-0.75 w-12 lg:block"></span>

        <div
          className={`max-xs:gap-3 flex gap-4 max-lg:w-full max-lg:justify-center max-lg:rounded-md max-lg:py-3 lg:flex-col ${NextPage && "hidden"}`}
        >
          <AnimatePresence>
            {links.map((link, index) => {
              return (
                <motion.div
                  whileHover="hover"
                  whileTap="hover"
                  initial="initial"
                  key={index}
                  className="relative flex items-center gap-6 max-lg:justify-center"
                >
                  <Link
                    className={`cursor-pointer text-2xl transition ${link.path === pathname ? "text-accent dark:text-accent-dark" : "hover:text-subtext dark:hover:text-subtext-dark text-heading dark:text-heading-dark"}`}
                    to={link.path}
                  >
                    {link.icon && (
                      <div className="relative flex">
                        <span
                          className={`absolute ${link.path === pathname ? "block" : "hidden"} bg-accent dark:bg-accent-dark -top-3 h-1.25 w-full cursor-auto max-lg:rounded-b-full lg:top-0 lg:-left-4 lg:h-full lg:w-1.25 lg:rounded-r-full`}
                        ></span>
                        <FontAwesomeIcon
                          icon={link.icon}
                          className="px-[9px] py-3"
                        />
                      </div>
                    )}
                  </Link>

                  {
                    <motion.span
                      variants={{
                        initial: { opacity: 0, x: 0, y: 0 },
                        hover: {
                          opacity: 1,
                          x: isMobile ? 0 : -22,
                          y: isMobile ? -22 : 0,
                        },
                      }}
                      className={`pointer-events-none absolute -z-10 rounded-md px-3 py-1 max-lg:mb-30 lg:ml-30 ${link.path === pathname ? "text-primary dark:text-primary-dark bg-accent dark:bg-accent-dark" : "text-heading dark:text-heading-dark bg-secondary dark:bg-secondary-dark"}`}
                    >
                      {/* pointer-events-none disabled hover for span */}
                      {link.name}
                    </motion.span>
                  }
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <span className="bg-subtext dark:bg-subtext-dark hidden h-0.75 w-12 lg:block"></span>

        <div
          className={`border-accent dark:border-accent-dark ${NextPage ? "max-xs:block" : "max-xs:hidden"} xs:max-sm:absolute xs:max-sm:right-4 relative flex items-center rounded-xl border-3 max-lg:justify-center`}
        >
          <AnimatePresence>
            <motion.div
              whileHover="hover"
              whileTap="hover"
              initial="initial"
              key="themeButton"
              className="relative flex cursor-pointer items-center justify-center"
              onClick={ThemeToggle}
            >
              <span
                className={`absolute ${ThemeDark ? "scale-y-0" : "scale-y-100"} bg-accent dark:bg-accent-dark top-2/3 left-5/6 h-full w-1 origin-top -translate-1/2 rotate-45 transition select-none`}
              ></span>

              <FontAwesomeIcon
                icon={faMoon}
                className={`${ThemeDark ? "text-accent-dark" : "text-heading"} px-[7px] py-2.5 text-2xl transition`}
              />

              <motion.span
                variants={{
                  initial: { opacity: 0, x: 0, y: 0 },
                  hover: {
                    opacity: 1,
                    x: isMobile ? 0 : -22,
                    y: isMobile ? -22 : 0,
                  },
                }}
                key="label"
                className={`pointer-events-none absolute rounded-md px-3 py-1 max-lg:mb-30 lg:ml-65 ${ThemeDark ? "text-primary-dark bg-accent-dark" : "text-primary bg-accent"}`}
              >
                Theme
              </motion.span>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          className="max-xs:block text-accent dark:text-accent-dark absolute right-1 hidden -rotate-90 cursor-pointer rounded-md text-xl transition"
          onClick={() => setNextPage(!NextPage)}
        >
          <FontAwesomeIcon
            icon={faAnglesDown}
            className={`${NextPage && "rotate-180"} transition`}
          />
        </button>
      </nav>
    </>
  );
};

export default nav;
