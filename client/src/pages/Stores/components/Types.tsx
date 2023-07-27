import { useLoaderData } from "react-router-dom";
import { StoreType, setFilterType } from "../../../types/types";
import styles from "./categories.module.css";
import { useState } from "react";

type Props = {
    isCurrentFilter: string;
    setFilter: setFilterType;
    viewWindow: string;
};

/**
 * List of buttons that set the type category
 * @isCurrentFilter current set type filter
 * @setFilter takes a type:string or size:string and set the filters for the product grid
 */
export default function Types({ isCurrentFilter, setFilter, viewWindow }: Props) {
    const { products } = useLoaderData() as StoreType;
    const [types] = useState(() =>
        products
            .map(product => product.categories)
            .flat()
            .filter((value, index, array) => array.indexOf(value) === index)
    );

    function isActive(cat: string) {
        return isCurrentFilter === cat ? [styles.category_item, styles.active].join(" ") : styles.category_item;
    }

    return (
        <ul className={[styles.types_category, styles[viewWindow]].join(" ")}>
            <li>
                <button className={isActive("")} onClick={() => setFilter({ type: "" })}>
                    All
                </button>
            </li>
            {types.map((category, i) => {
                return (
                    <li key={i}>
                        <button className={isActive(category)} onClick={() => setFilter({ type: category })}>
                            {category}
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}
