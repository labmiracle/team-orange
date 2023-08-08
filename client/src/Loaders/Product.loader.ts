import { Params } from "react-router-dom";
import { ProductService } from "../services/Product.service";

/**
 * Fetch the store products, colors, managers
 * @param params url params
 * @returns store object {@link Types.ProductType}
 */

// const paradigm = new HttpClient();

export const ProductsLoader = {
    async getProduct({ params }: { params: Params }) {
        const { productId } = params;
        if (Number(productId)) {
            try {
                const product = await ProductService.getProduct(Number(productId));
                return product;
            } catch (error) {
                console.log(error);
            }
        }
    },
};
