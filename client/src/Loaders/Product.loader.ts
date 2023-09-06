import { Params } from "react-router-dom";
import { ProductService } from "../services/Product.service";

export const ProductsLoader = {
    /**
     * Fetch the product by id
     * @param params url params
     * @returns product object {@link Product}
     */

    async getProduct({ params }: { params: Params<string> }) {
        const productService = new ProductService();
        const { productId } = params;
        if (Number(productId)) {
            const product = await productService.getProduct(Number(productId));
            return product;
        }
    },
    /**
     * Fetch all products by store id with and limit amount and a page number
     * @param storeId
     * @query page_number=number&product_amount=number
     * @returns product object {@link Product}
     */
    async getAllProducts({ params }: { request: Request; params: Params<string> }) {
        const productService = new ProductService();
        const { storeId } = params;
        if (Number(storeId)) {
            const data = await productService.getByFilter(Number(storeId));
            if (data?.products?.length === 0) throw new Error("Products not found");
            return data;
        }
    },
};
