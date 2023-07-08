import styles from "./categories.module.css";

type Prop = {
    categories: string[];
    changeCategory: (_: string) => void;
};

export default function CategoriesNav({ categories, changeCategory }: Prop) {
    const categoriesElements = categories.map(category => {
        return (
            <li>
                <button className={styles.button} onClick={() => changeCategory(category)}>
                    {category}
                </button>
            </li>
        );
    });

    return (
        <nav className={styles.nav_container}>
            <ul className={styles.nav_list}>
                <li>
                    <button className={styles.button} onClick={() => changeCategory("all")}>
                        All
                    </button>
                </li>
                {categoriesElements}
            </ul>
        </nav>
    );
}
