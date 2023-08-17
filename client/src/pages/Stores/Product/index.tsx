import styles from "./index.module.css";
import type {  Product } from "../../../types";
import { useLoaderData } from "react-router-dom";
import { useCart } from "../../../Hooks/useCart";
import { formatPrice } from "../../utilities/formatPrice";
import { Button } from "../../../components/ui/Button";
import { useEffect, useRef, useState } from "react";
import { assetsUrl } from "../../../endpoints";

export function Product() {
    const product = useLoaderData() as Product;
    const { addProduct } = useCart();
    const [showNotification, setShowNotification] = useState(false);
    const timerRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (showNotification === true) {
            timerRef.current = setTimeout(() => setShowNotification(false), 1000);
        }
        return () => {
            clearTimeout(timerRef.current);
        };
    }, [showNotification]);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const { amount } = event.target as HTMLFormElement;
        addProduct(product, Number(amount.value));
        setShowNotification(true);
    }

    return (
        <main className={styles.container}>
            <img src={`${assetsUrl}/${product.url_img}`} alt="A product image" width={500} />
            <div className={styles.infoContainer}>
                <div className={styles.content}>
                    <p className={styles.title}>{product.name}</p>
                    {product.discountPercentage < 1 ? (
                        <div className={styles.offerPriceContainer}>
                            <p className={styles.price}>{formatPrice(product.price * product.discountPercentage)}</p>
                            <p className={styles.oldPrice}>{formatPrice(product.price)}</p>
                        </div>
                    ) : (
                        <p className={styles.price}>{formatPrice(product.price)}</p>
                    )}
                    <p className={styles.description}>{product.description}</p>
                </div>

                <form className={styles.footer} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label htmlFor="amount">Cantidad</label>
                        <input id="amount" type="number" defaultValue={1} />
                    </div>
                    <Button
                        type="submit"
                        className={`${styles.addToCart} ${showNotification ? styles.notification : ""}`}
                        disabled={showNotification}>
                        {showNotification ? "Agregado!" : "Agregar al carrito"}
                    </Button>
                </form>
            </div>
        </main>
    );
}
