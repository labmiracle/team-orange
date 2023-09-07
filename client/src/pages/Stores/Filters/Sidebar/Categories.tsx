import { useLoaderData } from "react-router-dom";
import { setFilterType } from "../../../../types";
import styles from "./index.module.css";

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
export default function Categories({ isCurrentFilter, setFilter, viewWindow }: Props) {
    const { categories } = useLoaderData() as { categories: string[] };

    function isActive(cat: string) {
        return isCurrentFilter === cat ? [styles.category_item, styles.active].join(" ") : styles.category_item;
    }

    return (
        <ul className={[styles.types_category, styles[viewWindow]].join(" ")}>
            <li>
                <button className={isActive("")} onClick={() => setFilter({ category: "" })}>
                    All
                </button>
            </li>
            {categories.map((category, i) => {
                return (
                    <li key={i}>
                        <button className={isActive(category)} onClick={() => setFilter({ category: category })}>
                            {category}
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}
