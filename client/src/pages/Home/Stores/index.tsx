/* eslint-disable react-hooks/exhaustive-deps */
import { useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import { useProducts } from "../../utilities/useProducts";
import { StoreType } from "../../../types";
import { setColors } from "../../utilities/setColors";
import Product from "./Product";
import Nav from "./Nav";
import Types from "./Types";
import Sizes from "./Sizes";
import styles from "./css/index.module.css";
import Loader from "../../Loader";
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
            <Nav direction={"horizontal"}>
                <Sizes isCurrentFilter={filter.current.size} setFilter={setFilter} />
            </Nav>
            <div className={styles.inner_container}>
                <Nav direction={"vertical"}>
                    <Types isCurrentFilter={filter.current.type} setFilter={setFilter} />
                </Nav>
                <div className={styles.grid}>
                    {products.map((product, i) => {
                        return <Product product={product} key={i} sequencer={sequencer} setSequencer={setSequencer} />;
                    })}
                </div>
            </div>
        </div>
    );
}
