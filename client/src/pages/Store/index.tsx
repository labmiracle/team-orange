import { useLoaderData } from "react-router-dom";
import { ProductType } from "../types";
import Product from "./Product";
import CategoriesNav from "./CategoriesNav";
import styles from "./index.module.css";
import { useState, useEffect } from "react";

export default function Store() {
    const data = useLoaderData() as ProductType[];
    const [products, setProducts] = useState(data);

    const categories = data
        .map(product => product.category)
        .flat()
        .filter((value, index, array) => array.indexOf(value) === index);

    function changeCategory(category: string) {
        if (category === "all") {
            setProducts(data);
        } else {
            setProducts(() => data.filter(product => product.category.includes(category)));
        }
    }

    useEffect(() => {
        setProducts(data);
    }, [data]);

    return (
        <main>
            <CategoriesNav {...{ categories, changeCategory }} />
            <div className={styles.grid}>
                <Product {...{ arrayP: products }} />
            </div>
        </main>
    );
}
