import { useCart } from "../../Context/CartContext";
import { formatPrice } from "../utilities/formatPrice";
import styles from "./index.module.css";

export function Cart() {
    const { cart } = useCart();

    if (cart === null) return null;

    if (cart.length === 0) return <h1 className={styles.message}>No hay nada en el carrito</h1>;
    return (
        <main className={styles.container}>
            <ul className={styles.cartContainer}>
                {cart.map(item => (
                    <li className={styles.itemContainer} key={item.product.id}>
                        <img src={`http://localhost:4000/${item.product.url_img}`} alt="" width={100} height={100} />
                        <div className={styles.itemInfo}>
                            <div>{item.product.name}</div>
                            <div className={styles.priceContainer}>
                                {item.product.discountPercentage < 1 && (
                                    <div className={styles.oldPrice}>
                                        {formatPrice(item.product.price * item.amount)}
                                    </div>
                                )}
                                <div className={styles.price}>
                                    {formatPrice(item.product.price * item.product.discountPercentage * item.amount)}
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <div className={styles.paymentDataContainer}>
                <div>
                    <h2>Resumen de compra</h2>
                    <div className={styles.summary}>
                        <div className={styles.detail}>
                            <p>Productos ({cart.reduce((acc, element) => acc + element.amount, 0)})</p>
                            {formatPrice(
                                cart.reduce(
                                    (_, element) =>
                                        element.product.price * element.product.discountPercentage * element.amount,
                                    0
                                )
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <hr />
                    <div className={styles.detail}>
                        <h3>Total</h3>
                        <p>
                            {formatPrice(
                                cart.reduce(
                                    (_, element) =>
                                        element.product.price * element.product.discountPercentage * element.amount,
                                    0
                                )
                            )}
                        </p>
                    </div>
                    <button>Continuar</button>
                </div>
            </div>
        </main>
    );
}
