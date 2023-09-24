import { useLoaderData } from "react-router-dom";
import { Product, StoreWithProducts } from "@/types";
import { ProductService } from "@/services/Product.service";
import { Modal } from "@/components/ui/Modal";
import { useState } from "react";
import FormUpdateProduct from "./Update/FormUpdateProduct";
import styles from "../index.module.css";

export default function ProductsTable() {
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const data = useLoaderData() as StoreWithProducts;
    const [products, setProducts] = useState<Product[]>(data.products);
    const [product, setProduct] = useState<Product>({} as Product);

    const productService = new ProductService();

    async function handleDelete(id: number) {
        try {
            await productService.disable(id);
        } catch (e) {
            throw Error((e as Error).message);
        }
        setProducts(products => products.filter(p => p.id !== product.id));
    }

    async function handleUpdate(product: Product) {
        setProduct(product);
        setShowUpdateModal(true);
    }

    function handleModalClose() {
        setShowUpdateModal(false);
        setProduct({} as Product);
    }

    const productsRows = products.map(product => {
        return (
            <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.discountPercentage}</td>
                <td>{product.brand}</td>
                <td>{product.minimum}</td>
                <td>{product.reorderPoint}</td>
                <td>{product.categories}</td>
                <td>{product.sizes}</td>
                <td>{product.url_img}</td>
                <td>
                    <button className={styles.button} onClick={() => handleDelete(product.id)} title="delete">
                        ❌
                    </button>
                    <button className={styles.button} onClick={() => handleUpdate(product)} title="update">
                        ⚡
                    </button>
                </td>
            </tr>
        );
    });

    return (
        <>
            <Modal title="Update Product" isOpen={showUpdateModal} handleClose={handleModalClose}>
                <FormUpdateProduct product={product} setProduct={setProduct} setProducts={setProducts} />
            </Modal>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripcion</th>
                        <th>Precio</th>
                        <th>Descuento</th>
                        <th>Marca</th>
                        <th>Minimo</th>
                        <th>Punto de pedido</th>
                        <th>Categorias</th>
                        <th>Talles</th>
                        <th>URL Imagen</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>{productsRows}</tbody>
            </table>
        </>
    );
}
