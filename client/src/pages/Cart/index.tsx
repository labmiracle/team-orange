import { useState } from "react";
import { useCart } from "../../Context/CartContext";
import { formatPrice } from "../utilities/formatPrice";
import styles from "./index.module.css";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";

export function Cart() {
    const { cart } = useCart();
    const [showForm, setShowForm] = useState(false);

    function confirmCartContent() {
        setShowForm(true);
    }

    function confirmPayment() {
        setShowForm(false);
    }

    function backToCart() {
        setShowForm(false);
    }

    if (cart === null) return null;

    if (cart.length === 0) return <h1 className={styles.message}>No hay nada en el carrito</h1>;
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
                    <Button>Confirmar pago</Button>
                    <Button type="button" variant="ghost" onClick={backToCart}>
                        Volver
                    </Button>
                </form>
            ) : (
                <>
                    <ul className={styles.cartContainer}>
                        {cart.map(item => (
                            <li className={styles.itemContainer} key={item.product.id}>
                                <img
                                    src={`http://localhost:4000/${item.product.url_img}`}
                                    alt=""
                                    width={100}
                                    height={100}
                                />
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
                                    <p>Productos ({cart.reduce((acc, element) => acc + element.amount, 0)})</p>
                                    {formatPrice(
                                        cart.reduce(
                                            (acc, element) =>
                                                acc +
                                                element.product.price *
                                                    element.product.discountPercentage *
                                                    element.amount,
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
                                            (acc, element) =>
                                                acc +
                                                element.product.price *
                                                    element.product.discountPercentage *
                                                    element.amount,
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
