import styles from "./css/categories.module.css";

type Prop = {
    categories: string[];
    changeCategory: (_: string) => void;
    current: string;
    direction: "vertical" | "horizontal";
};

export default function CategoriesNav({ categories, changeCategory, current, direction }: Prop) {
    function isActive(cat: string) {
        return current === cat ? [styles.category, styles.active].join(" ") : styles.category;
    }

    const categoriesElements = categories.map((category, i) => {
        return (
            <li key={i}>
                <button className={isActive(category)} onClick={() => changeCategory(category)}>
                    {category}
                </button>
            </li>
        );
    });

    return (
        <nav className={styles.nav_container}>
            <ul className={styles[`nav_list_${direction}`]}>
                <li>
                    <button className={current === "" ? [styles.category, styles.active].join(" ") : styles.category} onClick={() => changeCategory("")}>
                        All
                    </button>
                </li>
                {categoriesElements}
            </ul>
        </nav>
    );
}
