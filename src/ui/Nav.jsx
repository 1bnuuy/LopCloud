import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloud,
  faHouse,
  faListCheck,
  faBook,
  faMoon,
  faEnvelope,
  faAnglesDown,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { btnVariants } from "./Theme";

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

const Nav = ({ pathname, ThemeDark, ThemeToggle }) => {
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
        className={`bg-secondary dark:bg-secondary-dark max-xs:gap-2 fixed left-4 z-40 flex h-18 w-11/12 items-start justify-between gap-5 rounded-md px-4 text-nowrap transition ease-in-out select-none max-lg:bottom-4 max-lg:left-1/2 max-lg:-translate-x-1/2 max-lg:items-center max-sm:justify-center lg:top-1/2 lg:h-11/12 lg:w-20 lg:-translate-y-1/2 lg:flex-col lg:justify-start lg:py-15 ${ThemeDark ? "dark" : ""}`}
      >
        <motion.button
            variants={btnVariants}
              whileHover="hover"
              whileTap="tap"
              initial="initial"
              key="loginButton"
              className="max-xs:hidden max-sm:absolute max-sm:left-4 bg-tertiary dark:bg-tertiary-dark ring-offset-secondary hover:ring-2 active:ring-2 active:ring-offset-3 hover:ring-offset-3 hover:ring-accent dark:hover:ring-accent-dark active:ring-accent dark:active:ring-accent-dark hover:text-primary active:text-primary ring-tertiary dark:ring-offset-secondary-dark dark:ring-tertiary-dark hover:bg-accent dark:hover:bg-accent-dark active:bg-accent text-heading dark:text-heading-dark dark:active:bg-accent-dark aspect-square cursor-pointer rounded-full text-2xl size-[48px]"
            >
              <FontAwesomeIcon icon={faPlus} />
            </motion.button>

        <span className="bg-subtext dark:bg-subtext-dark hidden h-0.75 w-12 lg:block"></span>

        <div
          className={`max-xs:gap-3 flex xs:!flex gap-4 max-lg:w-full max-lg:justify-center max-lg:rounded-md max-lg:py-3 lg:flex-col ${NextPage && "hidden"}`}
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
                    className={`text-2xl ${link.path === pathname ? "text-accent dark:text-accent-dark" : "hover:text-subtext dark:hover:text-subtext-dark text-heading dark:text-heading-dark"}`}
                    to={link.path}
                  >
                    {link.icon && (
                      <div className="relative flex">
                        <span
                          className={`absolute ${link.path === pathname ? "block" : "hidden"} bg-accent dark:bg-accent-dark -top-3 h-1.25 w-full max-lg:rounded-b-full lg:top-0 lg:-left-4 lg:h-full lg:w-1.25 lg:rounded-r-full`}
                        ></span>
                        <motion.button
                          variants={btnVariants}
                          whileHover="hover"
                          whileTap="tap"
                          initial="initial"
                          className={`cursor-pointer size-[48px] rounded-lg ${link.path === pathname && "bg-tertiary dark:bg-tertiary-dark"}`}
                        >
                          <FontAwesomeIcon
                            icon={link.icon}
                            className="px-[9px] py-3"
                          />
                        </motion.button>
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
                      className={`pointer-events-none absolute -z-10 rounded-md px-3 py-1 max-lg:mb-30 lg:ml-30 ${link.path === pathname ? "text-primary bg-accent dark:bg-accent-dark" : "text-heading dark:text-heading-dark bg-secondary dark:bg-secondary-dark"}`}
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
          className={`${NextPage ? "max-xs:block" : "max-xs:hidden"} xs:max-sm:absolute xs:max-sm:right-4 flex xs:flex-col gap-6`}
        >
          <AnimatePresence>
            <motion.div
              whileHover="hover"
              whileTap="hover"
              initial="initial"
              key="themeButton"
              className="border-accent dark:border-accent-dark relative flex cursor-pointer items-center justify-center rounded-xl border-3"
              onClick={ThemeToggle}
            >
              <span
                className={`absolute ${ThemeDark ? "scale-y-0" : "scale-y-100"} bg-accent dark:bg-accent-dark top-2/3 left-5/6 h-full w-1 origin-top -translate-1/2 rotate-45 transition select-none`}
              ></span>

              <FontAwesomeIcon
                icon={faMoon}
                className={`${ThemeDark ? "text-accent-dark" : "text-heading"} px-[7px] py-2.5 text-2xl`}
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
                className={`text-primary pointer-events-none absolute rounded-md px-3 py-1 max-lg:mb-30 lg:ml-65 ${ThemeDark ? "bg-accent-dark" : "bg-accent"}`}
              >
                Theme
              </motion.span>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          className="max-xs:block text-accent dark:text-accent-dark absolute right-1 hidden -rotate-90 cursor-pointer rounded-md text-xl"
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

export default Nav;
