import { ProductForCreation, StoreWithProducts } from "@/types";
import styles from "./index.module.css";
import { useEffect, useState } from "react";
import FormCreateProduct from "./FormCreateProduct";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/Context/AuthContext";
import { useContext } from "../index";
import { ProductService } from "@/services/Product.service";

export default function CreateProductContainer() {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { setCreate } = useContext();
    const data = useLoaderData() as StoreWithProducts;

    const [productsToCreate, setProductsToCreate] = useState<ProductForCreation[]>([
        {
            name: "",
            description: "",
            price: 0,
            discountPercentage: 1,
            brand: "",
            reorderPoint: 0,
            minimum: 0,
            categories: [],
            sizes: [],
            currentStock: 0,
            img_file: {} as File,
        },
    ]);

    async function handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault();
        const productService = new ProductService();

        for (const product of productsToCreate) {
            const form = new FormData();
            for (const prop in product) {
                const value = product[prop as keyof ProductForCreation] as string | Blob;
                if (!value) return;
                if (Array.isArray(prop)) {
                    for (const value of prop) {
                        form.append(prop, value);
                    }
                } else {
                    form.append(prop, value);
                }
            }
            try {
                await productService.post(form);
            } catch (e) {
                throw Error((e as Error).message);
            }
        }

        setCreate(false);
        navigate(`/manager/${user?.id}`);
    }

    function handleAddProductToCreate() {
        setProductsToCreate(prev => {
            return [
                ...prev,
                {
                    name: "",
                    description: "",
                    price: 0,
                    discountPercentage: 1,
                    brand: "",
                    reorderPoint: 0,
                    minimum: 0,
                    categories: [],
                    sizes: [],
                    currentStock: 0,
                    img_file: {} as File,
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
            <button
                onClick={() => {
                    setCreate(false);
                    navigate(`/manager/${user?.id}`);
                }}>
                {"<- back"}
            </button>
            <form onSubmit={handleSubmit} className={styles.product_create_form} encType="multipart/form-data">
                {productsInputs}
                <button onClick={handleAddProductToCreate} className={styles.add_btn}>
                    ➕
                </button>
                <button className={styles.submit_btn} type="submit">
                    create!
                </button>
            </form>
        </div>
    );
}
