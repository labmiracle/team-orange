import { useEffect, useState } from "react";
import { ProductResponse, setFilterType } from "../types";
import { ProductService } from "../services/Product.service";
import { Product as ProductType } from "../types";
import { useLocation, useParams, useRouteLoaderData } from "react-router-dom";

export type Props = [
    filter: {
        category: string;
        size: string;
    },
    setFilter: setFilterType,
    products: ProductType[],
    loading: boolean,
];

/**
 * Returns an array of products, a function to update it, the filter currently applied to the products and a function to update it's filters
 * @param productsArray - {@link Types.ProductType}
 * @returns - {@link Props}
 */
export function useProducts(): Props {
    const { storeId } = useParams();
    const location = useLocation();
    const data = useRouteLoaderData("products") as ProductResponse;
    const [filter, setFilterI] = useState({
        category: new URLSearchParams(location.search).get("category") || "",
        size: new URLSearchParams(location.search).get("size") || "",
    });
    const [loading, setLoading] = useState(false);
    const [nextPage, setNextPage] = useState(data.pagination.hasNextPage);
    const [page, setPage] = useState(1);
    const [products, setProducts] = useState<ProductType[]>(data.products);

    const fetchProducts = async () => {
        if (!nextPage || loading) return;
        setLoading(true);
        try {
            const productService = new ProductService();
            const response = await productService.getByFilter({
                storeId: Number(storeId),
                page,
                size: filter.size,
                category: filter.category,
            });
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
        setFilter({ size: "", category: "" });
    }, [storeId]);

    useEffect(() => {
        // Reset states
        setPage(1);
        setNextPage(data.pagination.hasNextPage);
        setProducts(data.products);
    }, [filter, data]);

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
        if (page > 1 && nextPage) {
            fetchProducts();
        }
    }, [page]);

    /**
     * Used By Types and Sizes components to change the products array filters
     **/
    function setFilter({ category, size }: { category?: string; size?: string }) {
        if (category !== undefined) setFilterI(prev => ({ ...prev, category }));
        if (size !== undefined) setFilterI(prev => ({ ...prev, size }));
    }

    return [filter, setFilter, products, loading];
}
