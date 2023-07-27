import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./Context/AuthContext.tsx";
import { CartProvider } from "./Context/CartContext.tsx";
import { RouterProvider } from "react-router-dom";
import { Router } from "./router.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <AuthProvider>
            <CartProvider>
                <RouterProvider router={Router} />
            </CartProvider>
        </AuthProvider>
    </React.StrictMode>
);
