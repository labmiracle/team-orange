import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./pages/Home/index.tsx";
import ErrorPage from "./pages/Error/index.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Welcome from "./pages/Welcome/index.tsx";
import Store1 from "./pages/Store1/index.tsx";
import Store2 from "./pages/Store2/index.tsx";
import Store3 from "./pages/Store3/index.tsx";

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
                path: "/stores/1",
                element: <Store1 />,
            },
            {
                path: "/stores/2",
                element: <Store2 />,
            },
            {
                path: "/stores/3",
                element: <Store3 />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
