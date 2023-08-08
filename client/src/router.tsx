import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./pages/Layout/";
import { ErrorPage } from "./pages/Error/";
import { Home } from "./pages/Home/";
import { Store } from "./pages/Stores";
import { StoresLoader } from "./Loaders/StoreLoader.ts";
import { ProductsLoader } from "./Loaders/Product.loader.ts";
import { Login } from "./pages/Login";
import { Product } from "./pages/Stores/Product";
import { Cart } from "./pages/Cart";
import { Register } from "./pages/Register";

export const Router = createBrowserRouter([
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
                loader: ProductsLoader.getProduct,
                element: <Product />,
            },
            {
                path: "/cart",
                element: <Cart />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
		],
	},
]);
