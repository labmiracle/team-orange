import styles from "./loader.module.css";

/* export default function Loader() {
    return (
        <div className={styles.container}>
            <div className={styles.lds_dual_ring}></div>
        </div>
    );
} */
export default function Loader() {
    return <div className={styles.lds_dual_ring}></div>;
}