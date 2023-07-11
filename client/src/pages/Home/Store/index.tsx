import { useLoaderData } from "react-router-dom";
import { StoreType } from "../../types";
import Product from "./Product";
import CategoriesNav from "./CategoriesNav";
import styles from "./css/index.module.css";
import { useState, useEffect, useRef } from "react";

/**
 * Set the text color depending on the brightness of the background color
 * @param light lightness of color
 * @returns
 */
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
        type: "",
        size: "",
    });

    const sizes = data.products.map(product => product.size).filter((value, index, array) => array.indexOf(value) === index);

    const types = data.products.map(product => product.category).filter((value, index, array) => array.indexOf(value) === index);

    function filterProducts() {
        let newProducts = data.products;
        if (filter.current.type) {
            newProducts = newProducts.filter(product => product.category === filter.current.type);
        }
        if (filter.current.size) {
            newProducts = newProducts.filter(product => product.size === filter.current.size);
        }
        setProducts(newProducts);
    }

    function changeType(type: string) {
        filter.current.type = type;
        filterProducts();
    }

    function changeSize(size: string) {
        filter.current.size = size;
        filterProducts();
    }

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
            <CategoriesNav {...{ categories: sizes, changeCategory: changeSize, current: filter.current.size, direction: "horizontal" }} />
            <div className={styles.products_with_category}>
                <CategoriesNav {...{ categories: types, changeCategory: changeType, current: filter.current.type, direction: "vertical" }} />
                <div className={styles.grid}>
                    <Product {...{ arrayP: products }} />
                </div>
            </div>
        </div>
    );
}
