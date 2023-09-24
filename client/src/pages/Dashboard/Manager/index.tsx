import styles from "./index.module.css";
import ProductsTable from "./ProductsTable";
import ColorsTable from "./ColorsTable";
import { NavLink, useLoaderData } from "react-router-dom";
import { ColorsType } from "@/types";
import { setColors } from "../../utilities/setColors";
import { useEffect } from "react";

export default function Manager() {
    const { colors } = useLoaderData() as { colors: ColorsType };
    setColors(colors);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <main className={styles.container}>
            <ColorsTable />
            <ProductsTable />
            <NavLink to="/manager/create_product">🚀 Create Product</NavLink>
        </main>
    );
}
