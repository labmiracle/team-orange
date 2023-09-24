import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./Context/AuthContext.tsx";
import { CartProvider } from "./Context/CartContext.tsx";
import { RouterProvider } from "react-router-dom";
import { Router } from "./router.tsx";
import "./index.css";
import Loader from "./pages/LoadingSpinner/index.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <AuthProvider>
            <CartProvider>
                <Suspense fallback={<Loader container={true} />}>
                    <RouterProvider router={Router} />
                </Suspense>
            </CartProvider>
        </AuthProvider>
    </React.StrictMode>
);
