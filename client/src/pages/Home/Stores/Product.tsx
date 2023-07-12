import { ProductType } from "../../../types";
import styles from "./css/product.module.css";

export default function Product({ product }: { product: ProductType }) {
    return (
        <div className={styles.product_container}>
            <div key={product.id} className={styles.product_card}>
                <img className={styles.product_img} src={product.url_img} width="200" height="200" />
                <p>{product.brand.toUpperCase()}</p>
                <h3 className={styles.product_name}>{product.name.toUpperCase()}</h3>
                {product.discount < 1 && <p className={styles.product_discount}>-%{100 - product.discount * 100} discount!</p>}
                <p className={styles.product_price}>${product.price * product.discount}</p>
                <p>size: {product.size}</p>
                <p>category: {product.category}</p>
            </div>
            <button className={styles.product_buyBtn}>Comprar</button>
        </div>
    );
}
