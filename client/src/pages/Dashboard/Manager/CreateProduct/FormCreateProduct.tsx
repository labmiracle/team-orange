import { ProductForCreation } from "@/types";
import TagInput from "./TagInput";
import styles from "./index.module.css";

type Props = {
    index: number;
    productsToCreate: ProductForCreation[];
    setProductsToCreate: React.Dispatch<React.SetStateAction<ProductForCreation[]>>;
};

export default function FormCreateProduct({ index, productsToCreate, setProductsToCreate }: Props) {
    function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const name = event.currentTarget.name;
        const value = event.currentTarget.value;
        setProductsToCreate(prev => prev.map((p, i) => (i === index ? { ...p, [name]: value } : p)));
    }
    console.log(productsToCreate);
    return (
        <fieldset className={styles.product_container}>
            <legend>Product {index + 1}</legend>
            <label>
                name
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={productsToCreate[index].name}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                description
                <textarea
                    id="description"
                    name="description"
                    value={productsToCreate[index].description}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                price
                <input
                    type="number"
                    min={0}
                    id="price"
                    name="price"
                    step={0.01}
                    value={productsToCreate[index].price}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                discount
                <input
                    type="number"
                    min={0}
                    max={1}
                    step={0.01}
                    id="discount"
                    name="discountPercentage"
                    value={productsToCreate[index].discountPercentage}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                brand
                <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={productsToCreate[index].brand}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                reorderPoint
                <input
                    type="number"
                    min={0}
                    id="reorderPoint"
                    name="reorderPoint"
                    value={productsToCreate[index].reorderPoint}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                minimum
                <input
                    type="number"
                    min={0}
                    id="minimum"
                    name="minimum"
                    value={productsToCreate[index].minimum}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                categories
                <TagInput index={index} name={"categories"} setProductsToCreate={setProductsToCreate} />
            </label>
            <label>
                sizes
                <TagInput index={index} name={"sizes"} setProductsToCreate={setProductsToCreate} />
            </label>
            <label>
                currentStock
                <input
                    type="number"
                    min={0}
                    id="currentStock"
                    name="currentStock"
                    value={productsToCreate[index].currentStock}
                    onChange={handleChange}
                    required
                />
            </label>
        </fieldset>
    );
}
