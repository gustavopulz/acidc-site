import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Shows from "./pages/Shows";
import Media from "./pages/Media";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { AdminAuthProvider } from "./admin/context/AuthContext";
import AdminLayout from "./admin/components/AdminLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminShows from "./admin/pages/AdminShows";
import AdminAlbums from "./admin/pages/AdminAlbums";
import AdminNews from "./admin/pages/AdminNews";

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
  {
    path: "/admin/login",
    element: (
      <AdminAuthProvider>
        <AdminLogin />
      </AdminAuthProvider>
    ),
  },
  {
    path: "/admin",
    element: (
      <AdminAuthProvider>
        <AdminLayout />
      </AdminAuthProvider>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "shows",     element: <AdminShows /> },
      { path: "albums",    element: <AdminAlbums /> },
      { path: "news",      element: <AdminNews /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
