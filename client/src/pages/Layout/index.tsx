import SignUpIconSVG from "../../assets/SignUpIconSVG";
import CartIconSVG from "../../assets/CartIconSVG";
import Footer from "./Footer";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { Link } from "../../components/ui/Link";
import { Input } from "../../components/ui/Input";
import { StoreName } from "../../types/types";

export default function Home() {
    const storeNames = useLoaderData() as StoreName[];
    const navigate = useNavigate();
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
                        {storeNames.map(store => {
                            return (
                                <Link to={`stores/${store.id}`} key={store.id}>
                                    {store.name}
                                </Link>
                            );
                        })}
                    </ul>

                    <div className={styles.buttons_container}>
                        <button className={styles.button_cart} onClick={() => navigate("/cart")}>
                            <CartIconSVG  />
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
