import styles from "./index.module.css";
import { ProductType } from "../../types";
import { useLoaderData } from "react-router-dom";

export function Product() {
    const product = useLoaderData() as ProductType;

    function formatPrice(price: number) {
        const formattedPrice = new Intl.NumberFormat("es-AR", { currency: "ARS", style: "currency" }).format(price);

        return formattedPrice;
    }

    return (
        <main className={styles.container}>
            <img src={"../../" + product.url_img} alt="A product image" width={500} />
            <div className={styles.infoContainer}>
                <div className={styles.content}>
                    <p className={styles.title}>{product.name}</p>
                    {product.discount < 1 ? (
                        <div className={styles.offerPriceContainer}>
                            <p className={styles.price}>{formatPrice(product.price * product.discount)}</p>
                            <p className={styles.oldPrice}>{formatPrice(product.price)}</p>
                        </div>
                    ) : (
                        <p className={styles.price}>{formatPrice(product.price)}</p>
                    )}
                    <p className={styles.description}>{product.description}</p>
                </div>
                <div className={styles.footer}>
                    <div className={styles.field}>
                        <label htmlFor="amount">Cantidad</label>
                        <input id="amount" type="number" defaultValue={1} />
                    </div>
                    <button>Agregar al carrito</button>
                </div>
            </div>
        </main>
    );
}
