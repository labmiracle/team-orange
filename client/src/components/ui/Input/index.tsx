import styles from "./index.module.css";

export function Input({
    className,
    id,
    children,
    error = "",
    ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
    return (
        <div className={`${styles.field} ${className}`}>
            <label htmlFor={id} className={styles.label}>
                {children}
            </label>
            <input {...props} className={`${styles.input} ${error && styles.inputError}`} id={id} autoComplete="off" />
            <small className={styles.error}>{error}</small>
        </div>
    );
}
