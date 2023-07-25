import { useCart } from "../../Context/CartContext";
import styles from "./index.module.css";

export function Cart() {
    const { cart } = useCart();

    if (cart === null) return null;

    if (cart.length === 0) return <h1 className={styles.message}>No hay nada en el carrito</h1>;
    return (
        <main>
            <div className={styles.cartContainer}>
                {cart.map(item => (
                    <li>{item.product.name}</li>
                ))}
            </div>
            <div className={styles.paymentDataContainer}>
                {cart.reduce(
                    (_, element) => element.product.price * element.product.discountPercentage * element.amount,
                    0
                )}
            </div>
        </main>
    );
}
