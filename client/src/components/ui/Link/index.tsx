import { NavLink, NavLinkProps } from "react-router-dom";
import styles from "./index.module.css";

export function Link({ children, className = "", ...props }: NavLinkProps & { className?: string }) {
    return (
        <li className={className}>
            <NavLink className={({ isActive }) => `${styles.link} ${isActive ? styles.active : styles.inactive}`} {...props}>
                {children}
            </NavLink>
        </li>
    );
}
