/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { ProductResponse, Product as ProductType } from "../../../types";
import { Product } from "./ProductCard/Product";
import styles from "./index.module.css";
import Loader from "../../LoadingSpinner";
import { useLoaderData, useNavigation, useParams } from "react-router-dom";
import { ProductService } from "../../../services/Product.service";
import { useFilter } from "..";

export default function Products() {
    const data = useLoaderData() as ProductResponse;
    const navigation = useNavigation();
    const { storeId } = useParams();
    const [sequencer, setSequencer] = useState<number[]>([]);
    const [products, setProducts] = useState<ProductType[]>(data?.products);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [nextPage, setNextPage] = useState(true);
    const [initialLoad, setInitialLoad] = useState(true);
    const { filter } = useFilter();

    useEffect(() => {
        setSequencer(() => products.map(product => +product.id));
    }, []);

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
        setInitialLoad(false);
        if (page > 1) {
            fetchProducts();
        }
    }, [page]);

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
        <>
            <div className={styles.products_container}>
                <div className={styles.grid}>
                    {products.map((product, i) => (
                        <Product product={product} key={i} sequencer={sequencer} setSequencer={setSequencer} />
                    ))}
                </div>
                {loading && (
                    <div className={styles.container_loader}>
                        <Loader />
                    </div>
                )}
                {!nextPage && (
                    <div className={styles.container}>
                        <p>No more products</p>
                    </div>
                )}
            </div>
        </>
    );
}
