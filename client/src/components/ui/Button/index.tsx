import styles from "./index.module.css";

export function Button({ children, className, variant = "solid", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }) {
    return (
        <button className={`${styles.button} ${styles[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
}
