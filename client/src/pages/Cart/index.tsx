import { useState } from "react";
import { useCart } from "../../services/useCart";
import { formatPrice } from "../utilities/formatPrice";
import styles from "./index.module.css";
import { Button } from "../../components/ui/Button";
import Invoice from "./Invoice";
import { useAuthContext } from "../../Context/AuthContext";
import { PaymentForm } from "./components/PaymentForm";
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
        return cart.reduce((acc, element) => acc + element.price * element.discountPercentage * element.quantity, 0);
    }

    function calculateTotalItems() {
        return cart.reduce((acc, element) => acc + element.quantity, 0);
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
                            <li className={styles.itemContainer} key={item.id}>
                                <img src={`http://localhost:4000/${item.url_img}`} alt="" width={100} height={100} />
                                <div className={styles.itemInfo}>
                                    <div>
                                        {item.name} ({item.quantity})
                                    </div>
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
