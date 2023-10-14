import { NavLink as RouterLink, NavLinkProps } from "react-router-dom";
import styles from "./index.module.css";

export function NavLink({ children, className = "", ...props }: NavLinkProps & { className?: string }) {
    return (
        <RouterLink
            className={({ isActive }) => `${isActive ? styles.active : styles.inactive} ${styles.link} ${className}`}
            {...props}>
            {children}
        </RouterLink>
    );
}
