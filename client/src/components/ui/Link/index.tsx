import { NavLink, NavLinkProps } from "react-router-dom";
import styles from "./index.module.css";

export function Link({ children, className = "", ...props }: NavLinkProps & { className?: string }) {
    return (
        <li className={className}>
            <NavLink
                className={({ isActive }) => `${isActive ? styles.active : styles.inactive} ${styles.link}`}
                {...props}>
                {children}
            </NavLink>
        </li>
    );
}
