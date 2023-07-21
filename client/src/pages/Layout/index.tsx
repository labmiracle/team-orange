import SignUpIconSVG from "../../assets/SignUpIconSVG";
import CartIconSVG from "../../assets/CartIconSVG";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import styles from "./index.module.css";
import { Link } from "../../components/ui/Link";
import { Input } from "../../components/ui/Input";

export default function Home() {
    return (
        <div className={styles.container}>
            <nav className={styles.nav}>
                <div className={`${styles.row} ${styles.firstRow}`}>
                    <h1>Shoppy</h1>
                    <ul>
                        <Link to="/">Inicio</Link>
                        <Link to="/products">Productos</Link>
                        <Link to="/contacts">Contactos</Link>
                    </ul>
                    <Input className={styles.search}></Input>
                </div>
                <div className={`${styles.row} ${styles.secondRow}`}>
                    <ul className={styles.stores}>
                        <Link to="stores/1">Store 1</Link>
                        <Link to="stores/2">Store 2</Link>
                        <Link to="stores/3">Store 3</Link>
                    </ul>

                    <div className={styles.buttons_container}>
                        <button className={styles.button_cart}>
                            <CartIconSVG />
                        </button>
                        <button className={styles.button_signup}>
                            <SignUpIconSVG />
                        </button>
                    </div>
                </div>
            </nav>
            <Outlet />
            <Footer />
        </div>
    );
}
