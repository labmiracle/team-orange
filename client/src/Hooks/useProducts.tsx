import { useEffect, useState } from "react";
import { ProductResponse, setFilterType } from "../types";
import { ProductService } from "../services/Product.service";
import { Product as ProductType } from "../types";
import { useParams, useRouteLoaderData } from "react-router-dom";

export type Props = [
    filter: {
        type: string;
        size: string;
    },
    setFilter: setFilterType,
    products: ProductType[],
    loading: boolean,
    sequencer: number[],
    setSequencer: React.Dispatch<React.SetStateAction<number[]>>,
];

/**
 * Returns an array of products, a function to update it, the filter currently applied to the products and a function to update it's filters
 * @param productsArray - {@link Types.ProductType}
 * @returns - {@link Props}
 */
export function useProducts(): Props {
    const { storeId } = useParams();
    const data = useRouteLoaderData("products") as ProductResponse;
    const [filter, setFilterI] = useState({ type: "", size: "" });
    const [loading, setLoading] = useState(false);
    const [nextPage, setNextPage] = useState(true);
    const [products, setProducts] = useState<ProductType[]>(data.products);
    const [page, setPage] = useState(1);
    const [initialLoad, setInitialLoad] = useState(true);
    const [sequencer, setSequencer] = useState<number[]>([]);

    const fetchProducts = async () => {
        if (!nextPage || loading) return;
        setLoading(true);
        try {
            const productService = new ProductService();
            const response = await productService.getByFilter(Number(storeId), page, 12, filter.size, filter.type);
            if (response?.products) {
                setProducts(prev => [...prev, ...response.products]);
            }
            setNextPage(response?.pagination.hasNextPage || false);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setSequencer(() => products.map(product => +product.id));
    }, []);

    /**
     * Reset states
     **/

    useEffect(() => {
        if (!initialLoad) {
            setNextPage(true);
            setPage(1);
            setProducts([]);
        }
    }, [filter]);

    useEffect(() => {
        if (!initialLoad) {
            fetchProducts();
        }
    }, [filter, nextPage]);

    /**
     * Infinite scroll
     **/

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop + 400 >= document.documentElement.scrollHeight) {
            setPage(prev => prev + 1);
        }
    };

    useEffect(() => {
        if (!nextPage) return;
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [nextPage]);

    useEffect(() => {
        setInitialLoad(false);
        if (page > 1) {
            fetchProducts();
        }
    }, [page]);

    /**
     * Used By Types and Sizes components to change the products array filters
     **/
    function setFilter({ type, size }: { type?: string; size?: string }) {
        if (type !== undefined) setFilterI(prev => ({ ...prev, type }));
        if (size !== undefined) setFilterI(prev => ({ ...prev, size }));
    }

    return [filter, setFilter, products, loading, sequencer, setSequencer];
}
