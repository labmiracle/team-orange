import { useLoaderData, Link, useParams } from "react-router-dom";
import { NavLink } from "../../../../components/ui/NavLink";
import { setFilterType } from "../../../../types";
import styles from "./index.module.css";

type Props = {
    filter: {
        category: string;
        size: string;
    };
    setFilter: setFilterType;
    viewWindow: string;
};

/**
 * List of buttons that set the type category
 * @isCurrentFilter current set type filter
 * @setFilter takes a type:string or size:string and set the filters for the product grid
 */
export default function Categories({ filter, setFilter, viewWindow }: Props) {
    const { categories } = useLoaderData() as { categories: string[] };
    const { storeId } = useParams();

    function isActive(cat: string) {
        return filter.category === cat ? [styles.category_item, styles.active].join(" ") : styles.category_item;
    }

    return (
        <ul className={[styles.types_category, styles[viewWindow]].join(" ")}>
            <li>
                <Link
                    to={`/stores/${storeId}/q`}
                    className={isActive("")}
                    onClick={filter.category !== "" ? () => setFilter({ category: "" }) : undefined}>
                    All
                </Link>
            </li>
            {categories.map((category, i) => {
                return (
                    <li key={i}>
                        <Link
                            to={`/stores/${storeId}/q?category=${category}&size=${filter.size}`}
                            onClick={() => setFilter({ category: category })}
                            className={isActive(category)}>
                            {category}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}
