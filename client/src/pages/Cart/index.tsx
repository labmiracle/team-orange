import { useState } from "react";
import { useCart } from "../../Hooks/useCart";
import { formatPrice } from "../utilities/formatPrice";
import styles from "./index.module.css";
import { Button } from "../../components/ui/Button";
import Invoice from "../utilities/Invoice";
import { PaymentForm } from "./PaymentForm";
import { assetsUrl } from "../../endpoints";
import { InvoiceInterface } from "../../types";
import EmptyCart from "./EmptyCart";
import TrashIconSVG from "../../assets/TrashSVG";
import { Link } from "../../components/ui/Link";

export default function Cart() {
    const { cart, clearCart, checkout, removeProduct, incrementProduct, decrementProduct } = useCart();
    const [showForm, setShowForm] = useState(false);
    const [invoice, setInvoice] = useState<InvoiceInterface | null>(null);
    const [isLoading, setLoading] = useState(false);
    function confirmCartContent() {
        setShowForm(true);
    }

    async function confirmPayment(event: React.FormEvent) {
        event.preventDefault();
        setLoading(true);
        const data = await checkout();
        setLoading(false);
        setInvoice(data);
        clearCart();
        setShowForm(false);
    }

    function backToCart() {
        setShowForm(false);
    }

    function calculateTotalPrice() {
        return cart.reduce((acc, item) => acc + item.price * item.discountPercentage * item.quantity, 0);
    }

    function calculateTotalItems() {
        return cart.reduce((acc, item) => acc + item.quantity, 0);
    }

    if (cart === null) return null;

    if (invoice) return <Invoice {...{ invoice }} />;
    if (cart.length === 0) return <EmptyCart />;

    return (
        <main className={styles.container}>
            {showForm ? (
                <PaymentForm submitAction={confirmPayment} isLoading={isLoading} backAction={backToCart} />
            ) : (
                <>
                    <ul className={styles.cartContainer}>
                        {cart.map(item => (
                            <li className={styles.itemContainer} key={item.id}>
                                <Link to={`/products/${item.id}`}>
                                    <div className={styles.containerImg}>
                                        <img
                                            src={`${assetsUrl}/${item.url_img}`}
                                            className={styles.productImg}
                                            alt={item.name}
                                        />
                                    </div>
                                </Link>
                                <div className={styles.containerContent}>
                                    <div className={styles.itemInfo}>
                                        <Link to={`/products/${item.id}`}>
                                            <div>{item.name}</div>
                                        </Link>
                                        <div className={styles.priceContainer}>
                                            {item.discountPercentage < 1 && (
                                                <div className={styles.oldPrice}>
                                                    {formatPrice(item.price * item.quantity)}
                                                </div>
                                            )}
                                            <div className={styles.price}>
                                                {formatPrice(item.price * item.discountPercentage * item.quantity)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.itemActions}>
                                        <div className={styles.counterContainer}>
                                            <Button
                                                onClick={() => decrementProduct(item)}
                                                className={`${styles.counterButton} ${
                                                    item.quantity === 1 ? styles.disableButton : ""
                                                }`}>
                                                -
                                            </Button>
                                            <span className={styles.quantity}>{item.quantity}</span>
                                            <Button
                                                onClick={() => incrementProduct(item)}
                                                className={`${styles.counterButton} ${
                                                    item.quantity >= item.currentStock ? styles.disableButton : ""
                                                }`}>
                                                +
                                            </Button>
                                        </div>
                                        <Button onClick={() => removeProduct(item)} className={styles.deleteButton}>
                                            <TrashIconSVG width="20px" />
                                        </Button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className={styles.purchaseSummaryContainer}>
                        <div>
                            <h2>Resumen de compra</h2>
                            <div className={styles.summary}>
                                <div className={styles.detail}>
                                    <p>Productos ({calculateTotalItems()})</p>
                                    {formatPrice(calculateTotalPrice())}
                                </div>
                            </div>
                        </div>
                        <div>
                            <hr />
                            <div className={styles.detail}>
                                <h3>Total</h3>
                                <p>{formatPrice(calculateTotalPrice())}</p>
                            </div>
                            <Button onClick={confirmCartContent} className={styles.continueButton}>
                                Continuar
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </main>
    );
}
