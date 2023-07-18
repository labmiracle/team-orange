import { ResultSetHeader } from "mysql2/promise";
import { Product, ResponseProduct } from "../models/productModel";
import { getProduct, getProducts, deleteProduct, createProduct, updateProduct } from "../repositories/productRepository";

export const getProductService = async (id: string | undefined): Promise<Product | undefined> => {
    const product = await getProduct(id);
    if (product) {
        return product;
    } else {
        throw new Error("Product not found");
    }
};

export const getProductsService = async (): Promise<Product[]> => {
    return await getProducts();
};

export const createProductService = async (product: ResponseProduct): Promise<boolean | undefined | ResultSetHeader> => {
    const response = await createProduct(product);
    return response;
};

export const deleteProductService = async (id: number) => {
    //agregar baja lógica
    return deleteProduct(id);
};

export const updateProductService = async (id: string, productData: Product) => {
    const productUpdated = await updateProduct(id, productData);
    if (!productUpdated) return undefined;
    return productUpdated;
};
