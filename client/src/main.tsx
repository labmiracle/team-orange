import React from "react";
import ReactDOM from "react-dom/client";
import Layout from "./pages/Layout/";
import ErrorPage from "./pages/Error/";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./pages/Home/";
import Store from "./pages/Stores/index.tsx";
import { StoresLoader } from "./Loaders/StoreLoader.ts";
import { ProductsLoader } from "./Loaders/Product.loader.ts";
import { Login } from "./pages/Login";
import { AuthProvider } from "./Context/AuthContext.tsx";
import { Product } from "./pages/Stores/Product/index.tsx";
import { CartProvider } from "./Context/CartContext.tsx";
import { Cart } from "./pages/Cart";

const router = createBrowserRouter([
    {
        element: <Layout />,
        errorElement: <ErrorPage />,
        loader: StoresLoader.getStoresName,
        children: [
            {
                path: "/",
                index: true,
                element: <Home />,
            },
            {
                path: "/stores/:id",
                loader: StoresLoader.getStore,
                element: <Store />,
            },
            {
                path: "/products/:productId",
                element: <Product />,
                loader: ProductsLoader.getProduct,
            },
            {
                path: "/cart",
                element: <Cart />,
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
            <CartProvider>
                <RouterProvider router={router} />
            </CartProvider>
        </AuthProvider>
    </React.StrictMode>
);
