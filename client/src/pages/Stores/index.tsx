/* eslint-disable react-hooks/exhaustive-deps */
import styles from "./index.module.css";
import Loader from "../LoadingSpinner";
import { useNavigation, Outlet, useOutletContext, useLoaderData } from "react-router-dom";
import { useProducts } from "../../Hooks/useProducts";
import Categories from "./Filters/Sidebar/Categories";
import Sizes from "./Filters/Sidebar/Sizes";
import { ColorsType, Product } from "../../types";
import CategoriesSmallMenu from "./Filters/Dropdown/CategoriesSmallMenu";
import { setColors } from "../utilities/setColors";

type ProductProps = {
    products: Product[];
    loading: boolean;
    sequencer: number[];
    setSequencer: React.Dispatch<React.SetStateAction<number[]>>;
};

export function Store() {
    const navigation = useNavigation();
    const { colors }: { colors: ColorsType } = useLoaderData() as { colors: ColorsType };
    setColors(colors);

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
            <CategoriesSmallMenu setFilter={setFilter} />
            <div className={styles.sidebar}>
                <div className={styles.container_sidebar}>
                    <div className={styles.sizes_menu}>
                        <p>Talles</p>
                        <Sizes filter={filter} setFilter={setFilter} viewWindow={"big"} />
                    </div>
                    <div className={styles.types_menu}>
                        <p>Categorias</p>
                        <Categories filter={filter} setFilter={setFilter} viewWindow={"big"} />
                    </div>
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
