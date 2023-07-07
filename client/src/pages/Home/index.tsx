import SignUpIconSVG from "../../assets/SignUpIconSVG";
import CartIconSVG from "../../assets/CartIconSVG";
import { Outlet, Link } from "react-router-dom";
import styles from "./styles.module.css";

export default function Home() {
    return (
        <main className={styles.home}>
            <nav className={styles.nav}>
                <div className={styles.logo}>
                    <Link to="/">Shoppy</Link>
                </div>
                <ul className={styles.stores}>
                    <li>
                        <Link to="/stores/1">Store1</Link>
                    </li>
                    <li>
                        <Link to="/stores/2">Store2</Link>
                    </li>
                    <li>
                        <Link to="/stores/3">Store3</Link>
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
