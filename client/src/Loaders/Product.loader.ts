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
    async getAllProducts({ request, params }: { request: Request; params: Params<string> }) {
        const productService = new ProductService();
        const { storeId } = params;
        const url = new URL(request.url);
        const category = url.searchParams.get("category");
        const size = url.searchParams.get("size");
        const page = url.searchParams.get("page");
        if (Number(storeId)) {
            const data = await productService.getByFilter({
                storeId: Number(storeId),
                size: size,
                category: category,
                page: Number(page),
            });
            return data;
        }
    },

    async getByManagerId({params}: {params: Params<string>}) {
        const productService = new ProductService();
        const {managerId} = params;
        const data = await productService.getByManager(Number(managerId))
        return data;
    }
};
