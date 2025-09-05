import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Todolist = () => {
  return (
    <section className="dark:bg-primary-dark grid-background bg-primary h-dvh w-screen overflow-hidden pt-8 transition-all max-lg:pb-25 md:pt-15 lg:px-25">
      <div className="relative flex h-full flex-col items-center gap-4 px-4">
        <p className="text-subtext dark:text-subtext-dark text-lg text-balance">
          Let's see what we've got to do today.
        </p>

        <div>
          <div className="bg-secondary relative border-subtext overflow-hidden dark:border-subtext-dark dark:bg-secondary-dark flex w-[90vw] max-w-[550px] items-center gap-4 rounded-md border-1 px-3 py-2.5">
            <input type="checkbox" className="peer appearance-none left-0 cursor-pointer absolute size-full"/>
            <span className="text-heading peer-checked:text-accent dark:text-heading-dark text-lg">
              Walk the dog
            </span>
            <div className="ml-auto flex items-center gap-2 z-40">
              <FontAwesomeIcon icon={faCheck} className="bg-accent-hovered max-w-[28px] rounded-md text-xl p-1"/>
            <FontAwesomeIcon icon={faXmark} className="bg-error-hovered text-error max-w-[28px] rounded-md text-xl p-1"/>
            </div>
        
          </div>
        </div>
      </div>
    </section>
  );
};

export default Todolist;
