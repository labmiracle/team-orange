import styles from "./index.module.css";
import { LoaderResponse, ProductType } from "../../../types/types";
import { useLoaderData } from "react-router-dom";
import { useCart } from "../../../Context/CartContext";

export function Product() {
    const { data: product } = useLoaderData() as LoaderResponse<ProductType>;
    const { addProduct } = useCart();

    console.log(product);
    function formatPrice(price: number) {
        const formattedPrice = new Intl.NumberFormat("es-AR", { currency: "ARS", style: "currency" }).format(price);

        return formattedPrice;
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const { amount } = event.target as HTMLFormElement;
        addProduct(product, Number(amount.value));
    }

    return (
        <main className={styles.container}>
            <img src={`http://localhost:4000/${product.url_img}`} alt="A product image" width={500} />
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
                    <button type="submit">Agregar al carrito</button>
                </form>
            </div>
        </main>
    );
}
