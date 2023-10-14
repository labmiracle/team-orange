import { createBrowserRouter } from "react-router-dom";
import { StoresLoader } from "./Loaders/Store.loader.ts";
import { ProductsLoader } from "./Loaders/Product.loader.ts";
import { UserLoader } from "./Loaders/User.loader.ts";
import { lazy } from "react";
import CreateProductContainer from "./pages/Dashboard/Manager/CreateProduct/CreateProductContainer.tsx";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Layout = lazy(() => import("./pages/Layout/"));
const ErrorPage = lazy(() => import("./pages/Error/"));
const Home = lazy(() => import("./pages/Home/"));
const Store = lazy(() => import("./pages/Stores"));
const Product = lazy(() => import("./pages/Stores/ProductBuyInfo"));
const Cart = lazy(() => import("./pages/Cart"));
const DashBoardUser = lazy(() => import("./pages/Dashboard/Usuario/index.tsx"));
const RequiredPage = lazy(() => import("./pages/utilities/RequiredPage.tsx"));
const UserData = lazy(() => import("./pages/Dashboard/Usuario/UserData/UserData.tsx"));
const UserInvoices = lazy(() => import("./pages/Dashboard/Usuario/UserInvoices/UserInvoices.tsx"));
const Admin = lazy(() => import("./pages/Dashboard/Admin/index.tsx"));
const Products = lazy(() => import("./pages/Stores/Products/index.tsx"));
const Manager = lazy(() => import("./pages/Dashboard/Manager/index.tsx"));

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
                id: "store",
                element: (
                    <RequiredPage rol="Manager">
                        <Manager />
                    </RequiredPage>
                ),
                loader: StoresLoader.getByManagerId,
                children: [
                    {
                        path: "/manager/:managerId/create_product",
                        element: (
                            <RequiredPage rol="Manager">
                                <CreateProductContainer />
                            </RequiredPage>
                        ),
                    },
                ],
            },
        ],
    },
]);
