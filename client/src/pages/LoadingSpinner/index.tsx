import styles from "./loader.module.css";

export default function Loader({ container = false }: { container?: boolean }) {
    return container ? (
        <div className={styles.container}>
            <div className={styles.lds_dual_ring}></div>
        </div>
    ) : (
        <div className={styles.lds_dual_ring}></div>
    );
}
