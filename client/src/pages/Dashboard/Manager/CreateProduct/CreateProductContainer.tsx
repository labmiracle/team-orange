import { ProductForCreation, Product as ProductType } from "@/types";
import styles from "./index.module.css";
import { useEffect, useState } from "react";
import FormCreateProduct from "./FormCreateProduct";
import { useNavigate } from "react-router-dom";

export default function CreateProductContainer() {
    const navigate = useNavigate();
    const [productsToCreate, setProductsToCreate] = useState<ProductForCreation[]>([
        {
            name: "",
            description: "",
            price: 0,
            discountPercentage: 0,
            brand: "",
            reorderPoint: 0,
            minimum: 0,
            categories: [],
            sizes: [],
            currentStock: 0,
            url_img: "",
        },
    ]);

    async function handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log(productsToCreate);
        // const productService = new ProductService();
        // try {
        //     await productService.post(productsToCreate);
        // } catch (e) {
        //     throw Error((e as Error).message);
        // }
        //setProducts(prev => [...prev, ...productsToCreate]);
    }

    function handleAddProductToCreate() {
        setProductsToCreate(prev => {
            return [
                ...prev,
                {
                    name: "",
                    description: "",
                    price: 0,
                    discountPercentage: 0,
                    brand: "",
                    reorderPoint: 0,
                    minimum: 0,
                    categories: [],
                    sizes: [],
                    currentStock: 0,
                    url_img: "",
                },
            ];
        });
    }

    const productsInputs = productsToCreate.map((_, i) => {
        return (
            <FormCreateProduct
                key={i}
                index={i}
                productsToCreate={productsToCreate}
                setProductsToCreate={setProductsToCreate}
            />
        );
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div>
            <button onClick={() => navigate(-1)}>{"<- back"}</button>
            <form onSubmit={handleSubmit} className={styles.product_create_form}>
                <div>{productsInputs}</div>
                <button onClick={handleAddProductToCreate} className={styles.add_btn}>
                    ➕
                </button>
                <button className={styles.submit_btn} type="submit">
                    create!
                </button>
            </form>
        </div>
    );

    /* return (
        <main>
            <button onClick={() => navigate(-1)} aria-roledescription="navigate back">
                BACK
            </button>
            <form onSubmit={handleSubmitCreate} className={styles.form}>
                {productsInputs}
                <button onClick={handleAddProductToCreate} className={styles.add_btn}>
                    ➕
                </button>
                <button className={styles.submit_btn} type="submit">
                    create!
                </button>
            </form>
        </main>
    ); */
}
