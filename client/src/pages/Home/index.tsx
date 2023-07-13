import SignUpIconSVG from "../../assets/SignUpIconSVG";
import CartIconSVG from "../../assets/CartIconSVG";
import Footer from "./Footer";
import { Outlet, Link, NavLink } from "react-router-dom";
import styles from "./home.module.css";

export default function Home() {
    return (
        <main className={styles.home}>
            <nav className={styles.nav}>
                <ul className={styles.stores}>
                    <li>
                        <NavLink to="/stores/1" className={({ isActive }) => (isActive ? styles.active : styles.inactive)}>
                            <p>Store1</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/stores/2" className={({ isActive }) => (isActive ? styles.active : styles.inactive)}>
                            <p>Store2</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/stores/3" className={({ isActive }) => (isActive ? styles.active : styles.inactive)}>
                            <p>Store3</p>
                        </NavLink>
                    </li>
                </ul>
                <Link to="/" className={styles.logo}>
                    Shoppy
                </Link>
                <div className={styles.buttons_container}>
                    <button className={styles.button_cart}>
                        <CartIconSVG />
                    </button>
                    <button className={styles.button_signup}>
                        <SignUpIconSVG />
                    </button>
                </div>
            </nav>
            <Outlet />
            <Footer />
        </main>
    );
}
