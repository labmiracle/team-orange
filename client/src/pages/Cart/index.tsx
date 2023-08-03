import { useEffect, useState } from "react";
import { useCart } from "../../services/useCart";
import { formatPrice } from "../utilities/formatPrice";
import styles from "./index.module.css";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import Invoice from "./Invoice";
import Loader from "../Loader";
import { useAuthContext } from "../../Context/AuthContext";
export function Cart() {
    const { cart, clearCart, checkout } = useCart();
    const { user } = useAuthContext();
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

    function calculateTotal() {
        return cart.reduce((acc, element) => acc + element.price * element.discountPercentage * element.quantity, 0);
    }

    if (cart === null) return null;

    if (!cart || cart.length === 0) {
        if (invoice) return <Invoice {...{ invoice }} />;
    }

    return (
        <main className={styles.container}>
            {showForm ? (
                <form onSubmit={confirmPayment} className={styles.paymentForm}>
                    <h3>Informacion personal</h3>
                    <div className={styles.personalInfo}>
                        <Input className={styles.name} required>
                            Nombre y apellido
                        </Input>
                        <Input className={styles.documentNumber} type="number" required>
                            Documento
                        </Input>
                    </div>
                    <h3>Medio de pago</h3>
                    <div className={styles.cardInfo}>
                        <Input required type="number">
                            Numero de la tarjeta
                        </Input>
                        <div className={styles.thirdRow}>
                            <Input type="month" required className={styles.expireDate}>
                                Vencimiento
                            </Input>
                            <Input type="number" required className={styles.securityCode}>
                                CVV
                            </Input>
                        </div>
                    </div>
                    {isLoading ? (
                        <div style={{ height: 35, margin: "auto" }}>
                            <Loader />
                        </div>
                    ) : (
                        <Button type="submit">Confirmar pago</Button>
                    )}
                    <Button type="button" variant="ghost" className={styles.backButton} onClick={backToCart}>
                        Volver
                    </Button>
                </form>
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
                                    <p>Productos ({cart.reduce((acc, element) => acc + element.quantity, 0)})</p>
                                    {formatPrice(calculateTotal())}
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
                                            (acc, element) =>
                                                acc + element.price * element.discountPercentage * element.quantity,
                                            0
                                        )
                                    )}
                                </p>
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
