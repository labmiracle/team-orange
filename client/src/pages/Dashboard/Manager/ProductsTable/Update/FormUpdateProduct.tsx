import { Product as ProductType } from "../../../../../types";
import { ProductService } from "../../../../../services/Product.service";
import styles from "./index.module.css";

export default function FormUpdateProduct({
    product,
    setProduct,
    setProducts,
}: {
    product: ProductType;
    setProduct: React.Dispatch<React.SetStateAction<ProductType>>;
    setProducts: React.Dispatch<React.SetStateAction<ProductType[]>>;
}) {
    function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const name = event.currentTarget.name;
        const value = event.currentTarget.value;
        setProduct(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmitUpdate(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault();
        const productService = new ProductService();
        try {
            await productService.update(product);
        } catch (e) {
            throw Error((e as Error).message);
        }
        setProducts(prev => prev.map(prd => (prd.id === product.id ? product : prd)));
    }

    return (
        <form onSubmit={handleSubmitUpdate} className={styles.form}>
            <label htmlFor="name">name:</label>
            <input type="text" id="name" name="name" value={product.name} onChange={handleChange} />
            <label htmlFor="description">description:</label>
            <textarea id="description" name="description" value={product.description} onChange={handleChange} />
            <label htmlFor="price">price:</label>
            <input
                type="number"
                min={0}
                id="price"
                name="price"
                step={0.01}
                value={product.price}
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
                value={product.discountPercentage}
                onChange={handleChange}
            />
            <label htmlFor="brand">brand:</label>
            <input type="text" id="brand" name="brand" value={product.brand} onChange={handleChange} />
            <label htmlFor="reorderPoint">reorderPoint:</label>
            <input
                type="number"
                min={0}
                id="reorderPoint"
                name="reorderPoint"
                value={product.reorderPoint}
                onChange={handleChange}
            />
            <label htmlFor="minimum">minimum:</label>
            <input type="number" min={0} id="minimum" name="minimum" value={product.minimum} onChange={handleChange} />
            <button className={styles.submit_btn} type="submit">
                update!
            </button>
        </form>
    );
}
