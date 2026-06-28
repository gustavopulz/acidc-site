import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate, useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import App from "./App";

function ErrorPage() {
  const err = useRouteError();
  const is404 = isRouteErrorResponse(err) && err.status === 404;
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-4 bg-black text-white p-8">
      <p className="text-6xl font-black text-red-600">{is404 ? "404" : "Erro"}</p>
      <p className="text-white/60 text-lg">{is404 ? "Página não encontrada." : "Algo deu errado."}</p>
      <Link to="/" className="mt-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition-colors">
        Voltar ao início
      </Link>
    </div>
  );
}
import Home from "./pages/Home";
import Shows from "./pages/Shows";
import Media from "./pages/Media";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Quote from "./pages/Quote";
import NewsPage from "./pages/News";
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
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "shows", element: <Shows /> },
      { path: "media", element: <Media /> },
      { path: "noticias", element: <NewsPage /> },
      { path: "sobre", element: <About /> },
      { path: "orcamento", element: <Quote /> },
      { path: "contato", element: <Contact /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
  {
    path: "/admin/login",
    errorElement: <ErrorPage />,
    element: (
      <AdminAuthProvider>
        <AdminLogin />
      </AdminAuthProvider>
    ),
  },
  {
    path: "/admin",
    errorElement: <ErrorPage />,
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
      { path: "*", element: <Navigate to="/admin/dashboard" replace /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
