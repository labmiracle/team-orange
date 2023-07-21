import React from "react";
import ReactDOM from "react-dom/client";
import Layout from "./pages/Layout/index.tsx";
import ErrorPage from "./pages/Error/index.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./pages/Home/";
import Store from "./pages/Stores/indext.tsx";
import storeLoader from "./pages/utilities/storeLoader.tsx";
import { Login } from "./pages/Login/index.tsx";
import { AuthProvider } from "./Context/authContext.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "/stores/:id",
                loader: storeLoader,
                element: <Store />,
            },
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </React.StrictMode>
);
