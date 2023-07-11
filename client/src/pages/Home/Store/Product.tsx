import { ProductType } from "../../types";
import styles from "./css/product.module.css";

export default function Product({ arrayP }: { arrayP: ProductType[] }) {
    const html = arrayP.map((item, i) => {
        return (
            <div className={styles.product_container} key={i}>
                <div key={item.id} className={styles.product_card}>
                    <img className={styles.product_img} src={item.url_img} width="200" height="200" />
                    <p>{item.brand.toUpperCase()}</p>
                    <h3 className={styles.product_name}>{item.name.toUpperCase()}</h3>
                    {item.discount < 1 && <p className={styles.product_discount}>-%{100 - item.discount * 100} discount!</p>}
                    <p className={styles.product_price}>${item.price * item.discount}</p>
                    <p>size: {item.size}</p>
                    <p>category: {item.category}</p>
                </div>
                <button className={styles.product_buyBtn}>Comprar</button>
            </div>
        );
    });
    return <>{html}</>;
}
