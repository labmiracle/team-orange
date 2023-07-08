import SignUpIconSVG from "../../assets/SignUpIconSVG";
import CartIconSVG from "../../assets/CartIconSVG";
import { Outlet, Link, NavLink } from "react-router-dom";
import styles from "./styles.module.css";

export default function Home() {
    return (
        <main className={styles.home}>
            <nav className={styles.nav}>
                <Link to="/" className={styles.logo}>
                    Shoppy
                </Link>
                <ul className={styles.stores}>
                    <li>
                        <NavLink to="/stores/1" className={({ isActive }) => (isActive ? styles.active : styles.inactive)}>
                            <p>Store1</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/stores/2" className={({ isActive }) => (isActive ? styles.active : styles.inactive)}>
                            <p>Store1</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/stores/3" className={({ isActive }) => (isActive ? styles.active : styles.inactive)}>
                            <p>Store1</p>
                        </NavLink>
                    </li>
                </ul>
                <div className={styles.buttons}>
                    <button className={styles.button_cart}>
                        <CartIconSVG />
                    </button>
                    <button className={styles.button_signup}>
                        <SignUpIconSVG />
                    </button>
                </div>
            </nav>
            <Outlet />
        </main>
    );
}
