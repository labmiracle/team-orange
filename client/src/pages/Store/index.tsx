import { useLoaderData } from "react-router-dom";
import { StoreType } from "../types";
import Product from "./Product";
import CategoriesNav from "./CategoriesNav";
import SizeNav from "./SizeNav";
import styles from "./index.module.css";
import { useState, useEffect, useRef } from "react";

function setTextColor(light: number) {
    if (light >= 50) {
        return "black";
    } else {
        return "white";
    }
}

export default function Store() {
    const data = useLoaderData() as StoreType;
    const [products, setProducts] = useState(data.products);
    const filter = useRef({
        category: "",
        size: "",
    });

    const sizes = data.products.map(product => product.size).filter((value, index, array) => array.indexOf(value) === index);

    const categories = data.products.map(product => product.category).filter((value, index, array) => array.indexOf(value) === index);

    function filterProducts() {
        let newProducts = data.products;
        if (filter.current.category) {
            newProducts = newProducts.filter(product => product.category === filter.current.category);
        }
        if (filter.current.size) {
            newProducts = newProducts.filter(product => product.size === filter.current.size);
        }
        setProducts(newProducts);
    }

    function changeCategory(category: string) {
        filter.current.category = category;
        filterProducts();
    }

    function changeSize(size: string) {
        filter.current.size = size;
        filterProducts();
    }

    //Set Colors
    /* useEffect(() => {
        const root = document.getElementById("root");
        const colors = data.colors;
        root?.style.setProperty("--text-primary", setTextColor(colors.primary.light));
        root?.style.setProperty("--text-secondary", setTextColor(colors.secondary.light));
        root?.style.setProperty("--primary", `hsl(${colors.primary.hue} ${colors.primary.sat}% ${colors.primary.light}%)`);
        root?.style.setProperty("--secondary", `hsl(${colors.secondary.hue} ${colors.secondary.sat}% ${colors.secondary.light}%)`);
        root?.style.setProperty("--tertiary", `hsl(${colors.primary.hue} ${colors.primary.sat - 7}% ${colors.primary.light + 10}%)`);
    }, [data.colors]); */

    useEffect(() => {
        setProducts(data.products);

        //SetColors
        const root = document.getElementById("root");
        const colors = data.colors;
        root?.style.setProperty("--text-primary", setTextColor(colors.primary.light));
        root?.style.setProperty("--text-secondary", setTextColor(colors.secondary.light));
        root?.style.setProperty("--primary", `hsl(${colors.primary.hue} ${colors.primary.sat}% ${colors.primary.light}%)`);
        root?.style.setProperty("--secondary", `hsl(${colors.secondary.hue} ${colors.secondary.sat}% ${colors.secondary.light}%)`);
        root?.style.setProperty("--tertiary", `hsl(${colors.primary.hue} ${colors.primary.sat - 7}% ${colors.primary.light + 10}%)`);
    }, [data]);

    return (
        <div className={styles.store_container}>
            <SizeNav {...{ sizes, changeSize }} />
            <div className={styles.products_with_category}>
                <CategoriesNav {...{ categories, changeCategory }} />
                <div className={styles.grid}>
                    <Product {...{ arrayP: products }} />
                </div>
            </div>
        </div>
    );
}
