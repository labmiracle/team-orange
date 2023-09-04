import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "./index.module.css";
import SignUpIconSVG from "../../../assets/SignUpIconSVG";
import ShopIconSVG from "../../../assets/ShopIconSVG";

export function DashBoardUser() {
    return (
        <main className={styles.main}>
            <nav className={styles.menu}>
                <ul>
                    <li>
                        <h2>Mi cuenta</h2>
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
