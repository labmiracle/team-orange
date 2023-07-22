/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { ProductType } from "../../types";
import styles from "./css/product.module.css";
import { Link, useNavigation } from "react-router-dom";

type ProductProps = {
    product: ProductType;
    sequencer: number[];
    setSequencer: React.Dispatch<React.SetStateAction<number[]>>;
};

export default function Product({ product, sequencer, setSequencer }: ProductProps) {
    const [loaded, setLoaded] = useState(false);
	const navigation = useNavigation();
	
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
                    onLoad={() => setLoaded(true)}
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = "/placeholder.jpg";
                    }}
                    className={styles.product_img}
                    src={product.url_img}
                    width="200"
                    height="200"
                    alt={product.name}
                />
                <p>{product.brand.toUpperCase()}</p>
                <h3 className={styles.product_name}>{product.name.toUpperCase()}</h3>
                {product.discount < 1 && <p className={styles.product_discount}>-%{100 - product.discount * 100} discount!</p>}
                <p className={styles.product_price}>${product.price * product.discount}</p>
                <p>{product.size}</p>
                <p>{product.category}</p>
            </div>
            <Link to={`products/${product.id}`}  className={styles.product_buyBtn}>Ver</Link>
        </div>
    );
}
