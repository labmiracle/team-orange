import { setFilterType } from "../../../../types";
import { useState } from "react";
import styles from "./index.module.css";
import { useLoaderData } from "react-router-dom";

type Props = {
    setFilter: setFilterType;
};

export default function CategoriesSmallMenu({ setFilter }: Props) {
    const [sizesState, setSizes] = useState("all");
    const [typesState, setTypes] = useState("all");
    const { sizes, categories } = useLoaderData() as { sizes: string[]; categories: string[] };

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const name = e.currentTarget.name;
        const value = e.currentTarget.value;
        if (name === "sizes") {
            setSizes(value);
            setFilter({ size: value });
        }
        if (name === "types") {
            setTypes(value);
            setFilter({ category: value });
        }
    }

    return (
        <div className={styles.menu_container}>
            <label>
                Sizes
                <select name={"sizes"} value={sizesState} onChange={handleChange}>
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
                Types
                <select name={"types"} value={typesState} onChange={handleChange}>
                    <option value={""}>All</option>
                    {categories.map(type => {
                        return (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        );
                    })}
                </select>
            </label>
        </div>
    );
}
