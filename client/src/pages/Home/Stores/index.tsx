import { useLoaderData } from "react-router-dom";
import { useEffect } from "react";
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

    //tarda 4.5ms/4.4ms con 10000 productos sin useMemo y hace en paralelo con otras tareas mucho mas pesadas, en refresh consecutivos el useCategory le ganaba al useMemo
    //const { sizes, types } = getCategories(data.products); //tarda 4.5ms/4.4ms con 10000 productos sin useMemo y hace en paralelo con otras tareas mucho mas pesadas
    const [products, setProducts, filter, setFilter] = useProducts(data.products);

    useEffect(() => {
        setProducts(data.products);

        //SetColors
        const colors = data.colors;
        setColors(colors);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    if (navigation.state === "loading") {
        return <Loader />;
    }

    return (
        <>
            <div className={styles.store_container}>
                <Nav direction={"horizontal"}>
                    <Sizes isCurrentFilter={filter.current.size} setFilter={setFilter} />
                </Nav>
                <div className={styles.inner_container}>
                    <Nav direction={"vertical"}>
                        <Types isCurrentFilter={filter.current.type} setFilter={setFilter} />
                    </Nav>
                    <div className={styles.grid}>
                        {products.map((product, i) => (
                            <Product product={product} key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
