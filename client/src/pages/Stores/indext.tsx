/* eslint-disable react-hooks/exhaustive-deps */
import { useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import { useProducts } from "../utilities/useProducts";
import { StoreType } from "../../types";
import { setColors } from "../utilities/setColors";
import Product from "./Product";
import Types from "./Types";
import Sizes from "./Sizes";
import CategoriesSmallMenu from "./Categories.small_menu";
import styles from "./css/index.module.css";
import Loader from "../Loader";
import { useNavigation } from "react-router-dom";

export default function Store() {
    const navigation = useNavigation();
    const data = useLoaderData() as StoreType;
    const [products, setProducts, filter, setFilter] = useProducts(data.products);

    const [sequencer, setSequencer] = useState<number[]>([]);

    useEffect(() => {
        setProducts(data.products);
        setSequencer(() => data.products.map(product => +product.id));
        const colors = data.colors;
        setColors(colors);
    }, [data]);

    if (navigation.state === "loading") {
        return <Loader />;
    }

    return (
        <div className={styles.store_container}>
            <CategoriesSmallMenu isCurrentFilter={filter} setFilter={setFilter} />
            <Sizes isCurrentFilter={filter.current.size} setFilter={setFilter} viewWindow={"big"} />
            <Types isCurrentFilter={filter.current.type} setFilter={setFilter} viewWindow={"big"} />
            <div className={styles.grid}>
                {products.map((product, i) => 
                    <Product product={product} key={i} sequencer={sequencer} setSequencer={setSequencer} />
                )}
            </div>
        </div>
    );
}
