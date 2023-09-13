import BagIconSVG from "../../../assets/BagIconSVG";
import { NavLink } from "../../../components/ui/NavLink";
import styles from "./index.module.css";

function EmptyCart() {
    return (
        <div className={styles.container_empty_cart}>
            <div className={styles.bg_empty_cart}>
                <BagIconSVG width="100px"></BagIconSVG>
                <p>¡Empieza un carrito de compras!</p>
                <NavLink to={`/stores/1/q`} className={styles.link}>
                    Descubrir productos
                </NavLink>
            </div>
        </div>
    );
}
export default EmptyCart;
