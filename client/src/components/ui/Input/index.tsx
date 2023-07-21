import styles from "./index.module.css";

export function Input({ className, id, children, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className={`${styles.field} ${className}`}>
            <label htmlFor={id} className={styles.label}>
                {children}
            </label>
            <input {...props} className={styles.input} id={id} />
        </div>
    );
}
