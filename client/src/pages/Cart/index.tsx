import { useState } from "react";
import { useCart } from "../../Hooks/useCart";
import { formatPrice } from "../utilities/formatPrice";
import styles from "./index.module.css";
import { Button } from "../../components/ui/Button";
import Invoice from "../utilities/Invoice";
import { PaymentForm } from "./components/PaymentForm";
import { assetsUrl } from "../../endpoints";
export function Cart() {
    const { cart, clearCart, checkout } = useCart();
    const [showForm, setShowForm] = useState(false);
    const [invoice, setInvoice] = useState(null);
    const [isLoading, setLoading] = useState(false);
    function confirmCartContent() {
        setShowForm(true);
    }

    function confirmPayment(event: React.FormEvent) {
        event.preventDefault();
        setLoading(true);
        checkout().then(data => {
            setLoading(false);
            setInvoice(data);
        });
        clearCart();
        setShowForm(false);
    }

    function backToCart() {
        setShowForm(false);
    }

    function calculateTotalPrice() {
        return cart.reduce((acc, item) => acc + item.product.price * item.product.discountPercentage * item.amount, 0);
    }

    function calculateTotalItems() {
        return cart.reduce((acc, item) => acc + item.amount, 0);
    }

    if (cart === null) return null;

    if (!cart || cart.length === 0) {
        if (invoice) return <Invoice {...{ invoice }} />;
    }

    return (
        <main className={styles.container}>
            {showForm ? (
                <PaymentForm submitAction={confirmPayment} isLoading={isLoading} backAction={backToCart} />
            ) : (
                <>
                    <ul className={styles.cartContainer}>
                        {cart.map(item => (
                            <li className={styles.itemContainer} key={item.product.id}>
                                <img src={`${assetsUrl}/${item.product.url_img}`} alt="" width={100} height={100} />
                                <div className={styles.itemInfo}>
                                    <div>
                                        {item.product.name} ({item.amount})
                                    </div>
                                    <div className={styles.priceContainer}>
                                        {item.product.discountPercentage < 1 && (
                                            <div className={styles.oldPrice}>
                                                {formatPrice(item.product.price * item.amount)}
                                            </div>
                                        )}
                                        <div className={styles.price}>
                                            {formatPrice(
                                                item.product.price * item.product.discountPercentage * item.amount
                                            )}
                                        </div>
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
                                <p>{calculateTotalPrice()}</p>
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
