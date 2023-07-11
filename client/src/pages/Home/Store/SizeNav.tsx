import styles from "./size.module.css";

type Prop = {
    sizes: string[];
    changeSize: (_: string) => void;
};

export default function SizeNav({ sizes, changeSize }: Prop) {
    const categoriesElements = sizes.map((size, i) => {
        return (
            <li key={i}>
                <button className={styles.button} onClick={() => changeSize(size)}>
                    {size}
                </button>
            </li>
        );
    });

    return (
        <nav className={styles.nav_container}>
            <ul className={styles.nav_list}>
                <li>
                    <button className={styles.button} onClick={() => changeSize("")}>
                        All
                    </button>
                </li>
                {categoriesElements}
            </ul>
        </nav>
    );
}
