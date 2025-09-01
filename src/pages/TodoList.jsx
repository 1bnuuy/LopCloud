import { motion } from "motion/react";

const Todolist = () => {
  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Home Page 🐰</h1>
      <p>Welcome to my cute app!</p>
    </motion.div>
  )
}

export default Todolist