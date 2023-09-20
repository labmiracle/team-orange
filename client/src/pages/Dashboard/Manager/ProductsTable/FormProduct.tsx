import { Product as ProductType } from "../../../../types";
import { ProductService } from "../../../../services/Product.service";
import { useState } from "react";
import styles from "../index.module.css";

export default function FormProduct({
    product,
    setProduct,
}: {
    product: ProductType;
    setProduct: React.Dispatch<React.SetStateAction<ProductType>>;
}) {
    const [formProduct, setFormProduct] = useState(product);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const name = event.currentTarget.name;
        const value = event.currentTarget.value;
        setFormProduct(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmitUpdate(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault();
        const productService = new ProductService();
        try {
            await productService.update(product);
        } catch (e) {
            throw Error((e as Error).message);
        }
        setProduct(formProduct);
    }

    return (
        <form onSubmit={handleSubmitUpdate}>
            <label htmlFor="name">name:</label>
            <input type="text" id="name" name="name" value={formProduct.name} onChange={handleChange} />
            <label htmlFor="description">description:</label>
            <input
                type="text"
                id="description"
                name="description"
                value={formProduct.description}
                onChange={handleChange}
            />
            <label htmlFor="price">price:</label>
            <input
                type="number"
                min={0}
                id="price"
                name="price"
                step={0.01}
                value={formProduct.price}
                onChange={handleChange}
            />
            <label htmlFor="discount">discount:</label>
            <input
                type="number"
                min={0}
                max={1}
                step={0.01}
                id="discount"
                name="discountPercentage"
                value={formProduct.discountPercentage}
                onChange={handleChange}
            />
            <label htmlFor="brand">brand:</label>
            <input type="text" id="brand" name="brand" value={formProduct.brand} onChange={handleChange} />
            <label htmlFor="reorderPoint">reorderPoint:</label>
            <input
                type="number"
                min={0}
                id="reorderPoint"
                name="reorderPoint"
                value={formProduct.reorderPoint}
                onChange={handleChange}
            />
            <label htmlFor="minimum">minimum:</label>
            <input
                type="number"
                min={0}
                id="minimum"
                name="minimum"
                value={formProduct.minimum}
                onChange={handleChange}
            />
            <button className={styles.button} type="submit">
                update!
            </button>
        </form>
    );
}
