/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { ProductType } from "../../types";
import styles from "./css/product.module.css";

type ProductProps = {
    product: ProductType;
    sequencer: number[];
    setSequencer: React.Dispatch<React.SetStateAction<number[]>>;
};

export default function Product(this: any, { product, sequencer, setSequencer }: ProductProps) {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (sequencer[0] === +product.id && loaded) {
            setTimeout(() => {
                setSequencer(prev => prev.filter(i => i !== +product.id));
            }, 50);
        }
    }, [sequencer, loaded]);

    return (
        <div id={`${product.id}`} className={sequencer.includes(+product.id) ? styles.hidden : styles.product_container}>
            <div key={product.id} className={styles.product_card}>
                <img
                    loading="lazy"
                    onLoad={() => setLoaded(true)}
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = "/placeholder.jpg";
                    }}
                    className={styles.product_img}
                    src={`http://localhost:4000/${product.url_img}`}
                    width="200"
                    height="200"
                    alt={product.name}
                />
                <p>{product.brand.toUpperCase()}</p>
                <h3 className={styles.product_name}>{product.name.toUpperCase()}</h3>
                {product.discountPercentage < 1 && <p className={styles.product_discount}>-%{100 - product.discountPercentage * 100} discount!</p>}
                <p className={styles.product_price}>${(product.price * product.discountPercentage).toFixed(2)}</p>
                <p>size: {product.sizes}</p>
                <p>category: {product.categories}</p>
            </div>
            <button className={styles.product_buyBtn}>Comprar</button>
        </div>
    );
}
