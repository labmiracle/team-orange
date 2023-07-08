import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./pages/Home/index.tsx";
import ErrorPage from "./pages/Error/index.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Welcome from "./pages/Welcome/index.tsx";
import Store from "./pages/Store/index.tsx";
import productsLoader from "./pages/Hooks/productsLoader.tsx";

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
                loader: async ({ params }) => {
                    return params.id ? await productsLoader(params.id) : null;
                },
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
