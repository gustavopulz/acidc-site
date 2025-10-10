import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Shows from "./pages/Shows";
import Media from "./pages/Media";
import About from "./pages/About";
import Contact from "./pages/Contact";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "shows", element: <Shows /> },
      { path: "media", element: <Media /> },
      { path: "sobre", element: <About /> },
      { path: "contato", element: <Contact /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
