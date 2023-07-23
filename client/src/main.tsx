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
import storesNamesLoader from "./pages/utilities/storeNamesLoader.tsx";
import { Product } from "./pages/Product";
import { FetchProduct } from "./pages/Product/FetchProduct.ts";

const router = createBrowserRouter([
    {
        element: <Layout />,
        errorElement: <ErrorPage />,
        loader: storesNamesLoader,
        children: [
            {
                path: "/",
                index: true,
                element: <Home />,
            },
            {
                path: "/stores/:id",
                loader: storeLoader,
                element: <Store />,
            },
            {
                path: "/stores/:id/products/:productId",
                element: <Product />,
                loader: FetchProduct,
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
