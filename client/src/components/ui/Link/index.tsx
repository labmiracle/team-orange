import { Link as RouterLink } from "react-router-dom";
import styles from "./index.module.css";
import { LinkProps } from "react-router-dom";

export function Link({ children, className = "", ...props }: LinkProps & { className?: string }) {
    return (
        <RouterLink className={`${styles.link || ""} ${className}`} {...props}>
            {children}
        </RouterLink>
    );
}
