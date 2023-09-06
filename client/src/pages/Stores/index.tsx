/* eslint-disable react-hooks/exhaustive-deps */
import { ContextType, useEffect, useRef, useState } from "react";
import { ProductResponse, StoreType } from "../../types";
import { setColors } from "../utilities/setColors";
import styles from "./index.module.css";
import Loader from "../LoadingSpinner";
import { useNavigation, useLoaderData, Outlet, useOutletContext } from "react-router-dom";
// import Products from "./Products";
import { useProducts } from "../../Hooks/useProducts";
import Types from "./Filters/Types";
import Sizes from "./Filters/Sizes";
import CategoriesSmallMenu from "./Filters/Categories.small_menu";
// import PageNumbers from "./PageNumbers.tsx";

export function Store() {
    const navigation = useNavigation();
    const data = useLoaderData() as StoreType;
    const [filter, setFilter] = useProducts();

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
                <Outlet context={{ filter }} />
            </div>
        </div>
    );
}

export function useFilter() {
    return useOutletContext<ContextType>();
}
