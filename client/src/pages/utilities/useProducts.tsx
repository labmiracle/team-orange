import { useRef, useState } from "react";
import { ProductType, setFilterType } from "../../types/index.d";

type Props = [
    ProductType[],
    React.Dispatch<React.SetStateAction<ProductType[]>>,
    React.MutableRefObject<{
        type: string;
        size: string;
    }>,
    setFilterType,
];

/**
 * Returns an array of products, a function to update it, the filter currently applied to the products and a function to update it's filters
 * @param productsArray - {@link Types.ProductType}
 * @returns - {@link Props}
 */
export function useProducts(productsArray: ProductType[]): Props {
    const [products, setProducts] = useState(productsArray);

    const filter = useRef({
        type: "",
        size: "",
    });

    function filterProducts() {
        let newProducts = productsArray;
        if (filter.current.type) {
            newProducts = newProducts.filter(product => product.category.includes(filter.current.type));
        }
        if (filter.current.size) {
            newProducts = newProducts.filter(product => product.size.includes(filter.current.size));
        }
        setProducts(newProducts);
    }

    /**
     * Used By Types and Sizes components to change the products array filters
     */
    function setFilter({ type, size }: { type?: string; size?: string }) {
        if (type !== undefined) filter.current.type = type;
        if (size !== undefined) filter.current.size = size;
        filterProducts();
    }

    return [products, setProducts, filter, setFilter];
}
