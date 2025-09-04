import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";

import Home from "./pages/Home.jsx";
import TodoList from "./pages/TodoList.jsx";
import Dictionary from "./pages/Dictionary.jsx";
import Contact from "./pages/Contact.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";

import ToastProvider from "./ui/Toast.jsx";
import ThemeProvider from "./ui/Theme.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "todolist", element: <TodoList /> },
      { path: "dictionary", element: <Dictionary /> },
      { path: "bnuuyPanel/dictionary", element: <Dictionary /> }, //Admin route :3
      { path: "contact", element: <Contact /> },
      { path: "*", element: <ErrorPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
);
