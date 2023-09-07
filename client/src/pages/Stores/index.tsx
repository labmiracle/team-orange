/* eslint-disable react-hooks/exhaustive-deps */
import styles from "./index.module.css";
import Loader from "../LoadingSpinner";
import { useNavigation, Outlet, useOutletContext } from "react-router-dom";
import { useProducts } from "../../Hooks/useProducts";
import Types from "./Filters/Types";
import Sizes from "./Filters/Sizes";
import { Product } from "../../types";
import CategoriesSmallMenu from "./Filters/Categories.small_menu";

type ProductProps = {
    products: Product[];
    loading: boolean;
    sequencer: number[];
    setSequencer: React.Dispatch<React.SetStateAction<number[]>>;
};

export function Store() {
    const navigation = useNavigation();
    const [filter, setFilter, products, loading, sequencer, setSequencer] = useProducts();

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
        <div className={styles.store_container}>
            <CategoriesSmallMenu isCurrentFilter={filter} setFilter={setFilter} />
            <div className={styles.sideBar}>
                <div className={styles.sizes_menu}>
                    <p>Talles</p>
                    <Sizes isCurrentFilter={filter.size} setFilter={setFilter} viewWindow={"big"} />
                </div>
                <div className={styles.types_menu}>
                    <p>Categorias</p>
                    <Types isCurrentFilter={filter.type} setFilter={setFilter} viewWindow={"big"} />
                </div>
            </div>
            <div className={styles.products_container}>
                <Outlet context={{ products, loading, sequencer, setSequencer }} />
            </div>
        </div>
    );
}

export function useContext() {
    return useOutletContext<ProductProps>();
}
