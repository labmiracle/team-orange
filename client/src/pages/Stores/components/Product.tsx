/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import type { Product } from "../../../types";
import styles from "./product.module.css";
import { Link } from "react-router-dom";
import { assetsUrl } from "../../../endpoints";

type ProductProps = {
    product: Product;
    sequencer: number[];
    setSequencer: React.Dispatch<React.SetStateAction<number[]>>;
};

export function Product({ product, sequencer, setSequencer }: ProductProps) {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (sequencer[0] === +product.id && loaded) {
            setTimeout(() => {
                setSequencer(prev => prev.filter(i => i !== +product.id));
            }, 50);
        }
    }, [sequencer, loaded]);

    return (
        <div
            id={`${product.id}`}
            className={sequencer.includes(+product.id) ? styles.hidden : styles.product_container}>
            <div key={product.id} className={styles.product_card}>
                <img
                    onLoad={() => setLoaded(true)}
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = "/placeholder.jpg";
                    }}
                    className={styles.product_img}
                    src={`${assetsUrl}/${product.url_img}`}
                    width="200"
                    height="200"
                    alt={product.name}
                />
                <div className={styles.infoProduct}>
                    <p>{product.brand.toUpperCase()}</p>
                    <h3 className={styles.product_name}>{product.name.toUpperCase()}</h3>
                    {product.discountPercentage < 1 && (
                        <p className={styles.product_discount}>-%{100 - product.discountPercentage * 100} discount!</p>
                    )}
                    <p className={styles.product_price}>${(product.price * product.discountPercentage).toFixed(2)}</p>
                    <p>{product.sizes}</p>
                    <p>{product.categories}</p>
                </div>
            </div>
            <Link to={`/products/${product.id}`} className={styles.product_buyBtn}>
                <span>Ver</span>
            </Link>
        </div>
    );
}
