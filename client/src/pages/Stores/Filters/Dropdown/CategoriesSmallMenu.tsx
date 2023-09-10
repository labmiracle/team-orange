import { setFilterType } from "../../../../types";
import styles from "./index.module.css";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";

type Props = {
    filter: {
        category: string;
        size: string;
    };
    setFilter: setFilterType;
};

export default function CategoriesSmallMenu({ filter, setFilter }: Props) {
    const { sizes, categories } = useLoaderData() as { sizes: string[]; categories: string[] };
    const { storeId } = useParams();
    const navigate = useNavigate();

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const name = e.currentTarget.name;
        const value = e.currentTarget.value;
        if (name === "sizes") {
            setFilter({ size: value });
            navigate(`/stores/${storeId}/q?category=${filter.category}&size=${value}`);
        }
        if (name === "category") {
            setFilter({ category: value });
            navigate(`/stores/${storeId}/q?category=${value}&size=${filter.size}`);
        }
    }

    return (
        <div className={styles.menu_container}>
            <label>
                Sizes
                <select name={"sizes"} value={filter.size} onChange={handleChange}>
                    <option value={""}>All</option>
                    {sizes.map(size => {
                        return (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        );
                    })}
                </select>
            </label>
            <label>
                Category
                <select name={"category"} value={filter.category} onChange={handleChange}>
                    <option value={""}>All</option>
                    {categories.map(category => {
                        return (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        );
                    })}
                </select>
            </label>
        </div>
    );
}
