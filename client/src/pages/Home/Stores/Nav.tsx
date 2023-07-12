import styles from "./css/categories.module.css";

type Props = {
    direction: "vertical" | "horizontal";
    children: React.ReactNode;
};

export default function Nav({ direction, children }: Props) {
    return (
        <nav className={styles.nav_container}>
            <ul className={styles[`nav_list_${direction}`]}>{children}</ul>
        </nav>
    );
}
