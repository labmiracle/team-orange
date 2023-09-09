import { useLoaderData, Link, useParams } from "react-router-dom";
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
 * List of buttons that set the size category
 * @isCurrentFilter current set type filter
 * @setFilter takes a type:string or size:string and set the filters for the product grid
 */
export default function Sizes({ filter, setFilter, viewWindow }: Props) {
    const { sizes } = useLoaderData() as { sizes: string[] };
    const { storeId } = useParams();

    function isActive(cat: string) {
        return filter.size === cat ? [styles.category_item, styles.active].join(" ") : styles.category_item;
    }

    return (
        <ul className={[styles.sizes_category, styles[viewWindow]].join(" ")}>
            <li>
                <Link
                    to={`/stores/${storeId}/q`}
                    className={isActive("")}
                    onClick={filter.size !== "" ? () => setFilter({ size: "" }) : undefined}>
                    All
                </Link>
            </li>
            {sizes.map((size, i) => {
                return (
                    <li key={i}>
                        <Link
                            to={`/stores/${storeId}/q?category=${filter.category}&size=${size}`}
                            onClick={() => setFilter({ size: size })}
                            className={isActive(size)}>
                            {size}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}
