import { useState } from "react";
import { setFilterType } from "../types";

type Props = [
    filter: {
        type: string;
        size: string;
    },
    setFilter: setFilterType,
];

/**
 * Returns an array of products, a function to update it, the filter currently applied to the products and a function to update it's filters
 * @param productsArray - {@link Types.ProductType}
 * @returns - {@link Props}
 */
export function useProducts(): Props {
    const [filter, setFilterI] = useState({
        type: "",
        size: "",
    });

    // function filterProducts(pArray: Product[]) {
    //     let newProducts = pArray;
    //     if (filter.type) {
    //         newProducts = newProducts.filter(product => product.categories.includes(filter.type));
    //     }
    //     if (filter.size) {
    //         newProducts = newProducts.filter(product => product.sizes.includes(filter.size));
    //     }
    //     return newProducts;
    // }

    // const [products, _setState] = useState(filterProducts(productsArray));

    // function setProducts(pArray: Product[]) {
    //     _setState(() => filterProducts(pArray));
    // }

    /**
     * Used By Types and Sizes components to change the products array filters
     */
    function setFilter({ type, size }: { type?: string; size?: string }) {
        if (type !== undefined) setFilterI(prev => ({ ...prev, type }));
        if (size !== undefined) setFilterI(prev => ({ ...prev, size }));
    }

    return [filter, setFilter];
}
