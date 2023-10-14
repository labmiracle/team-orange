import styles from "./index.module.css";
import ProductsTable from "./ProductsTable";
import ColorsTable from "./ColorsTable";
import { NavLink, Outlet, useLoaderData, useOutletContext } from "react-router-dom";
import { ColorsType } from "@/types";
import { setColors } from "../../utilities/setColors";
import { useEffect, useState } from "react";

type Outlet = {
    setCreate: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Manager() {
    const [create, setCreate] = useState(false);
    const { colors } = useLoaderData() as { colors: ColorsType };
    setColors(colors);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (create) return <Outlet context={{ setCreate }} />;
    else
        return (
            <main className={styles.container}>
                <ColorsTable />
                <NavLink to="create_product" onClick={() => setCreate(true)}>
                    🚀 Create Product
                </NavLink>
                <ProductsTable />
            </main>
        );
}

export function useContext() {
    return useOutletContext<Outlet>();
}
