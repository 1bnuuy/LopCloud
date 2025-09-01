const Todolist = () => {
  return (
    <section className="dark:bg-primary-dark grid-background bg-primary h-dvh w-screen overflow-hidden pt-8 transition-all max-lg:pb-25 md:pt-15 lg:px-25">
      <div className="relative flex h-full flex-col items-center gap-4 px-4">
        <span className="text-accent dark:text-accent-dark text-2xl font-semibold text-nowrap md:text-3xl lg:text-4xl">
          Tasks & Carrots
        </span>
        <span className="text-subtext dark:text-subtext-dark text-xl text-nowrap">
          Let's see what we've got to do today.
        </span>

        <div></div>
      </div>
    </section>
  );
};

export default Todolist;
