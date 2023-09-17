import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./pages/Layout/";
import { ErrorPage } from "./pages/Error/";
import { Home } from "./pages/Home/";
import { Store } from "./pages/Stores";
import { StoresLoader } from "./Loaders/Store.loader.ts";
import { ProductsLoader } from "./Loaders/Product.loader.ts";
import { Login } from "./pages/Login";
import { Product } from "./pages/Stores/ProductBuyInfo";
import { Cart } from "./pages/Cart";
import { Register } from "./pages/Register";
import { DashBoardUser } from "./pages/Dashboard/Usuario/index.tsx";
import { UserLoader } from "./Loaders/User.loader.ts";
import { RequiredPage } from "./pages/utilities/RequiredPage.tsx";
import UserData from "./pages/Dashboard/Usuario/UserData/UserData.tsx";
import UserInvoices from "./pages/Dashboard/Usuario/UserInvoices/UserInvoices.tsx";
import Admin from "./pages/Dashboard/Admin/index.tsx";
import Products from "./pages/Stores/Products/index.tsx";
import Manager from "./pages/Dashboard/Manager/index.tsx";

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
                path: "/stores/:storeId",
                loader: StoresLoader.getStore,
                element: <Store />,
                children: [
                    {
                        path: "/stores/:storeId/q",
                        index: true,
                        id: "products",
                        loader: ProductsLoader.getAllProducts,
                        element: <Products />,
                    },
                    {},
                ],
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
                        <DashBoardUser />
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
                    const stores = await StoresLoader.getAllStores();
                    return { users, stores };
                },
            },
            {
                path: "/manager/:managerId",
                element: (
                    <RequiredPage rol="Manager">
                        <Manager />
                    </RequiredPage>
                ),
                loader: ProductsLoader.getByManagerId,
            },
        ],
    },
]);
