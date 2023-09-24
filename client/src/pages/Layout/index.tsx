import CartIconSVG from "../../assets/CartIconSVG";
import Footer from "./Footer";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { Link } from "../../components/ui/Link";
import { NavLink } from "../../components/ui/NavLink";
import { StoreName, Token } from "../../types";
import { useAuthContext } from "../../Context/AuthContext";
import Fetcher from "../../services/Fetcher";
import { useEffect, useState } from "react";
import { decodeJwt } from "jose";
import ScrollToTop from "../../components/ui/ScrollToTop";

export default function Layout() {
    const { user, logOut } = useAuthContext();
    const storeNames = useLoaderData() as StoreName[];
    const navigate = useNavigate();
    const [visible, setVisible] = useState(true);
    const [prevScrollPos, setPrevScrollPos] = useState(window.scrollY);

    const handleScroll = () => {
        const currentScrollPos = window.scrollY;
        if (currentScrollPos > 109) {
            const visible = currentScrollPos < prevScrollPos;
            setPrevScrollPos(currentScrollPos);
            setVisible(visible);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    });

    useEffect(() => {
        const token = window.localStorage.getItem("user");
        if (token) {
            const user = decodeJwt(token) as Token;
            if (user.exp < Date.now() / 1000) {
                logOut();
            } else {
                Fetcher.addAuthInterceptor(token);
            }
        }
    }, [user]);

    return (
        <div className={styles.container}>
            <nav className={`${styles.nav} ${visible ? styles.visible : styles.hidden}`}>
                <div className={`${styles.logo_user_nav}`}>
                    <Link to="/" className={styles.logo}>
                        <h1>Shoppy</h1>
                    </Link>
                    <div className={styles.buttons_container}>
                        {user ? (
                            <>
                                Hi, {user.name} {user.lastName}
                                <NavLink to="/profile" className={styles.link}>
                                    Mi perfil
                                </NavLink>
                                <button className={styles.link} onClick={logOut}>
                                    logout
                                </button>
                                {user.rol === "Admin" && (
                                    <NavLink to="/admin" className={styles.link}>
                                        Admin
                                    </NavLink>
                                )}
                                {user.rol == "Manager" && (
                                    <NavLink to={`/manager/${user.id}`} className={styles.link}>
                                        Manager
                                    </NavLink>
                                )}
                            </>
                        ) : (
                            <>
                                <NavLink to="/register" className={styles.link}>
                                    Registrarse
                                </NavLink>
                                <NavLink to="/login" className={styles.link}>
                                    Ingresar
                                </NavLink>
                            </>
                        )}
                        <button
                            className={styles.button_cart}
                            onClick={() => navigate("/cart")}
                            aria-label="Ir al carrito de compras">
                            <CartIconSVG width={"100%"} />
                        </button>
                    </div>
                </div>
                <ul className={styles.stores_nav}>
                    {storeNames.map(store => {
                        return (
                            <li key={store.id}>
                                <NavLink to={`stores/${store.id}/q`}>{store.name}</NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <Outlet />
            <Footer />
            <ScrollToTop />
        </div>
    );
}
