import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "./index.module.css";
import MenuSVG from "../../../assets/MenuSVG";
import SignUpIconSVG from "../../../assets/SignUpIconSVG";
import ShopIconSVG from "../../../assets/ShopIconSVG";

export function DashBoardUsuario() {
    return (
        <main className={styles.main}>
            <nav className={styles.menu}>
                <ul>
                    <li>
                        <MenuSVG width={30} />
                        <h2>Mi Cuenta</h2>
                    </li>
                    <li>
                        <Link to="/profile">
                            <SignUpIconSVG width={30} />
                            Datos
                        </Link>
                    </li>
                    <li>
                        <Link to="/profile/invoices">
                            <ShopIconSVG width={30} />
                            Historial Compras
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className={styles.outlet}>
                <Outlet />
            </div>
        </main>
    );
}
