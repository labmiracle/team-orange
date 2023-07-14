import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./pages/Home/index.tsx";
import ErrorPage from "./pages/Error/index.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Welcome from "./pages/Home/Welcome/index.tsx";
import Store from "./pages/Home/Stores/index.tsx";
import storeLoader from "./pages/utilities/storeLoader.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Welcome />,
            },
            {
                path: "/stores/:id",
                loader: storeLoader,
                element: <Store />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
