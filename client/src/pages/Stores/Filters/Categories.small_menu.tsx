import Sizes from "./Sizes";
import Types from "./Types";
import { Product, StoreType, setFilterType } from "../../../types";
import { useState } from "react";
import styles from "./menu.module.css";
import MenuSVG from "../../../assets/MenuSVG";
import { useLoaderData } from "react-router-dom";

type Props = {
    isCurrentFilter: {
        type: string;
        size: string;
    };
    setFilter: setFilterType;
};

export default function CategoriesSmallMenu({ isCurrentFilter, setFilter }: Props) {
    const [visible, setVisibility] = useState(false);
    const [sizesState, setSizes] = useState("all");
    const [typesState, setTypes] = useState("all");
    const { sizes, categories } = useLoaderData() as { sizes: string[]; categories: string[] };
    /* const sizesProduct = products
        .map(product => product.sizes)
        .flat()
        .filter((value, index, array) => array.indexOf(value) === index); */

    /* const typesProduct = products
        .map(product => product.categories)
        .flat()
        .filter((value, index, array) => array.indexOf(value) === index); */

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const name = e.currentTarget.name;
        const value = e.currentTarget.value;
        if (name === "sizes") {
            setSizes(value);
            setFilter({ size: value });
        }
        if (name === "types") {
            setTypes(value);
            setFilter({ type: value });
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

    /* return (
        <div className={styles.menu_container}>
            <div
                onClick={() => setVisibility(last => !last)}
                className={visible ? styles.menu_background : styles.hidden}></div>
            <button className={styles.menu_button} onClick={() => setVisibility(last => !last)}>
                <MenuSVG />
            </button>
            <menu className={visible ? styles.menu : styles.hidden}>
                <div>
                    <h4>Sizes</h4>
                    <Sizes isCurrentFilter={isCurrentFilter.current.size} setFilter={setFilter} viewWindow={"small"} />
                </div>
                <div>
                    <h4>Types</h4>
                    <Types isCurrentFilter={isCurrentFilter.current.type} setFilter={setFilter} viewWindow={"small"} />
                </div>
            </menu>
        </div>
    ); */
}
