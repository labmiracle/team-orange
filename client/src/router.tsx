import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./pages/Layout/";
import { ErrorPage } from "./pages/Error/";
import { Home } from "./pages/Home/";
import { Store } from "./pages/Stores";
import { StoresLoader } from "./Loaders/Store.loader.ts";
import { ProductsLoader } from "./Loaders/Product.loader.ts";
import { Login } from "./pages/Login";
import { Product } from "./pages/Stores/Product";
import { Cart } from "./pages/Cart";
import { Register } from "./pages/Register";
import { DashBoardUsuario } from "./pages/Dashboard/Usuario/index.tsx";
import { UserLoader } from "./Loaders/User.loader.ts";
import { RequiredPage } from "./pages/utilities/RequiredPage.tsx";
import UserData from "./pages/Dashboard/Usuario/UserData.tsx";
import UserInvoices from "./pages/Dashboard/Usuario/UserInvoices.tsx";
import Admin from "./pages/Admin/index.tsx";

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
                path: "/profile",
                element: (
                    <RequiredPage>
                        <DashBoardUsuario />
                    </RequiredPage>
                ),
                children: [
                    {
                        path: "/profile",
                        index: true,
                        element: <UserData />,
                    },
                    {
                        path: "/profile/invoices",
                        loader: UserLoader.getInvoices,
                        element: <UserInvoices />,
                    },
                ],
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/admin",
                element: (
                    <RequiredPage rol="Admin">
                        <Admin />
                    </RequiredPage>
                ),
                loader: async () => {
                    const users = await UserLoader.getAllUsers();
                    const stores = await StoresLoader.getStoresName();
                    return { users, stores };
                },
            },
        ],
    },
]);
