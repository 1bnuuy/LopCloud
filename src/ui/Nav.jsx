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
import { useState } from "react";

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
  const [NextPage, setNextPage] = useState(false)

  return (
    <>
      <nav
        className={`bg-secondary dark:bg-secondary-dark fixed max-lg:left-1/2 left-4 max-lg:-translate-x-1/2 z-50 flex h-18 w-11/12 items-start max-lg:items-center justify-between gap-5 max-xs:gap-2 text-nowrap transition duration-300 ease-in-out select-none max-lg:bottom-4 max-sm:justify-center lg:top-1/2 lg:-translate-y-1/2 lg:h-11/12 lg:w-20 lg:flex-col lg:justify-start rounded-md lg:px-4 lg:py-15 ${ThemeDark ? "dark" : ""}`}
      >
        <div className="relative flex items-center justify-center gap-6 max-xs:hidden max-sm:absolute max-sm:left-4">
          <FontAwesomeIcon
            icon={faCloud}
            className={`peer hover:ring-offset-secondary hover:ring-heading dark:hover:ring-offset-secondary-dark dark:hover:ring-heading-dark text-main dark:text-main-dark bg-heading dark:bg-heading-dark cursor-pointer rounded-md px-[8.25px] py-3 text-2xl transition duration-300 hover:ring-2 hover:ring-offset-3`}
          />
          <h1 className="border-accent dark:border-accent-dark text-heading dark:text-heading-dark hidden translate-x-12 rounded-md border-2 px-3 py-1 text-3xl font-semibold opacity-0 transition duration-300 peer-hover:translate-x-4 peer-hover:opacity-100 lg:block">
            Lop
            <span className="text-accent dark:text-accent-dark">Cloud</span>
          </h1>
        </div>

        <span className="bg-subtext dark:bg-subtext-dark hidden h-0.75 w-12 lg:block"></span>

        <div className={`flex gap-4 max-lg:bg-secondary dark:max-lg:bg-secondary-dark max-lg:py-3 max-lg:rounded-md max-lg:w-full max-lg:justify-center max-xs:gap-3 lg:flex-col ${NextPage && "hidden"}`}>
          {links.map((link, index) => {
            return (
              <div
                key={index}
                className="relative flex items-center gap-6 max-lg:justify-center"
              >
                <Link
                  className={`peer cursor-pointer text-2xl transition duration-200 ${link.path === pathname ? "text-accent dark:text-accent-dark" : "hover:text-subtext dark:hover:text-subtext-dark text-heading dark:text-heading-dark"}`}
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
                  <span
                    className={`absolute -z-10 peer-active:z-50 rounded-md px-3 py-1 opacity-0 transition duration-300 peer-hover:opacity-100 peer-active:opacity-100 max-lg:-translate-y-0 max-lg:peer-hover:-translate-y-22 max-lg:peer-active:-translate-y-22 lg:translate-x-30 lg:peer-hover:translate-x-22 ${link.path === pathname ? "text-main dark:text-main-dark bg-accent dark:bg-accent-dark" : "text-heading dark:text-heading-dark bg-secondary dark:bg-secondary-dark"}`}
                  >
                    {link.name}
                  </span>
                }
              </div>
            );
          })}
        </div>

        <span className="bg-subtext dark:bg-subtext-dark hidden h-0.75 w-12 lg:block"></span>

        <div className={`border-accent dark:border-accent-dark ${NextPage ? "max-xs:block" : "max-xs:hidden"} relative flex items-center max-lg:justify-center xs:max-sm:absolute xs:max-sm:right-4 rounded-xl border-3`}>
          <div
            className="peer relative flex cursor-pointer items-center"
            onClick={ThemeToggle}
          >
            <span
              className={`absolute ${ThemeDark ? "scale-y-0" : "scale-y-100"} bg-accent top-2/3 left-5/6 h-full w-1 origin-top -translate-1/2 rotate-45 transition duration-300 select-none`}
            ></span>
            
            <FontAwesomeIcon
              icon={faMoon}
              className={`${ThemeDark ? "text-accent-dark" : "text-heading"} px-[7px] py-2.5 text-2xl transition duration-300`}
            />
          </div>
          <span
            className={`text-main dark:text-main-dark bg-accent dark:bg-accent-dark absolute rounded-md px-3 py-1 opacity-0 transition duration-300 peer-hover:opacity-100 peer-active:opacity-100 max-lg:-translate-y-30 max-lg:peer-hover:-translate-y-22 max-lg:peer-active:-translate-y-22 max-sm:hidden lg:translate-x-30 lg:peer-hover:translate-x-22`}
          >
            Theme
          </span>
        </div>

        <button className="max-xs:block hidden cursor-pointer absolute w-full rounded-md bg-secondary dark:bg-secondary-dark -top-9 text-lg transition duration-300 text-accent dark:text-accent-dark" onClick={() => setNextPage(!NextPage)}>
          <FontAwesomeIcon icon={faAnglesDown} className={`${NextPage && "rotate-180"} transition`}/>
        </button>
      </nav>
    </>
  );
};

export default nav;
