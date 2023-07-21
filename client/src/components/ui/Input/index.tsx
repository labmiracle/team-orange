import styles from "./index.module.css";

export function Input({ className, id, children, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className={styles.field}>
            <label htmlFor={id} className={styles.label}>
                {children}
            </label>
            <input {...props} className={`${styles.input} ${className}`} id={id} />
        </div>
    );
}
