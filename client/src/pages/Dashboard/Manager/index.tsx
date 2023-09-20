import styles from "./index.module.css";
import ProductsTable from "./ProductsTable";
import ColorsTable from "./ColorsTable";

export default function Manager() {
    return (
        <main className={styles.container}>
            <ColorsTable />
            <ProductsTable />
        </main>
    );
}
