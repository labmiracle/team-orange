import { useLoaderData } from "react-router-dom";
import { StoreType, setFilterType } from "../../../types";
import styles from "./css/categories.module.css";
import { useState } from "react";

type Props = {
    isCurrentFilter: string;
    setFilter: setFilterType;
};

/**
 * List of buttons that set the size category
 * @isCurrentFilter current set type filter
 * @setFilter takes a type:string or size:string and set the filters for the product grid
 */
export default function Sizes({ isCurrentFilter, setFilter }: Props) {
    const { products } = useLoaderData() as StoreType;
    const [sizes] = useState(() =>
        products
            .map(product => product.size)
            .flat()
            .filter((value, index, array) => array.indexOf(value) === index)
    );

    function isActive(cat: string) {
        return isCurrentFilter === cat ? [styles.category, styles.active].join(" ") : styles.category;
    }

    return (
        <>
            <li>
                <button className={isActive("")} onClick={() => setFilter({ size: "" })}>
                    All
                </button>
            </li>
            {sizes.map((category, i) => {
                return (
                    <li key={i}>
                        <button className={isActive(category)} onClick={() => setFilter({ size: category })}>
                            {category}
                        </button>
                    </li>
                );
            })}
        </>
    );
}