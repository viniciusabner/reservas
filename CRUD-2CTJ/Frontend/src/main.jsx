import * as React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import Manage from "./pages/GerenciarReservas";
import Home from "./pages";

// Criando roteamento para rotas do react
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "gerenciar",
    element: <Manage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
