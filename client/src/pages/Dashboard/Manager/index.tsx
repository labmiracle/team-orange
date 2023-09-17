import { useLoaderData } from "react-router-dom";
import { Product } from "../../../types";
import { ProductService } from "../../../services/Product.service";
import { Modal } from "../../../components/ui/Modal";
import { useState } from "react";
import FormProduct from "./FormProduct";

export default function Manager() {
    const [showModal, setShowModal] = useState(false);
    const data = useLoaderData() as Product[];
    const [products, setProducts] = useState<Product[]>(data);
    const [product, setProduct] = useState<Product | null>(null);

    const productService = new ProductService();

    async function handleDelete(id: number) {
        await productService.disable(id);
    }

    async function handleUpdate(product: Product) {
        setProduct(product);
    }

    const productsRows = data.map(product => {
        return (
            <tr>
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
                    <button onClick={() => handleDelete(product.id)}>delete</button>
                    <button onClick={() => handleUpdate(product)}>update</button>
                </td>
            </tr>
        );
    });

    return (
        <>
            <Modal title="Select store to manage" isOpen={showModal} handleClose={() => setShowModal(false)}>
                <FormProduct product={product} setProduct={setProduct}/>
            </Modal>
            <table>
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
                    </tr>
                </thead>
                <tbody>{productsRows}</tbody>
            </table>
        </>
    );
}
