/* eslint-disable react-hooks/exhaustive-deps */
import { Product } from "./ProductCard/Product";
import styles from "./index.module.css";
import Loader from "../../LoadingSpinner";
import { useNavigation } from "react-router-dom";
import { useContext } from "..";
import { useEffect, useState } from "react";

export default function Products() {
    const navigation = useNavigation();
    const { products, loading } = useContext();
    const [sequencer, setSequencer] = useState<number[]>([]);

    useEffect(() => {
        if (products.length <= 12) {
            setSequencer(() => products.map(product => +product.id));
        }
    }, [products]);

    if (navigation.state === "loading") {
        return (
            <div style={{ minHeight: "100%", margin: "auto", position: "relative" }}>
                <div style={{ height: "80px", top: "calc(50% - 40px)", position: "absolute" }}>
                    <Loader />
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={styles.products_container}>
                {products.length !== 0 && (
                    <div className={styles.grid}>
                        {products.map((product, i) => (
                            <Product product={product} key={i} sequencer={sequencer} setSequencer={setSequencer} />
                        ))}
                    </div>
                )}
                {loading && (
                    <div className={styles.loader_container}>
                        <Loader />
                    </div>
                )}
                {products.length === 0 && (
                    <div className={styles.not_found_container}>
                        <p>Producto no encontrado, intente con otros filtros.</p>
                    </div>
                )}
            </div>
        </>
    );
}
