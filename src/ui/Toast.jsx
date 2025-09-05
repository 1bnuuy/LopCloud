import { useState, createContext, useContext } from "react";
import { useTheme } from "./Theme";
import { AnimatePresence, motion } from "motion/react";

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const { ThemeDark } = useTheme();

  const open = (component) => {
    const id = Date.now() + Math.random();
    setToasts((toast) => [...toast, { id, component: component(id) }]);

    setTimeout(() => close(id), 5000);
  };

  const close = (id) =>
    setToasts((toast) => toast.filter((toast) => toast.id !== id));

  return (
    <ToastContext.Provider value={{ open, close }}>
      {children}
      <div
        className={`${ThemeDark && "dark"} absolute overflow-hidden right-0 flex-col flex items-end top-5 z-40 gap-3 max-sm:items-center px-5`}
      >
        <AnimatePresence>
          {toasts.map(({ id, component }) => (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.2 }}
              key={id}
            >
              {component}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
