import { Params } from "react-router-dom";
// import { HttpClient } from "@miracledevs/paradigm-web-fetch";
/**
 * Fetch the store products, colors, managers
 * @param params url params
 * @returns store object {@link Types.ProductType}
 */

// const paradigm = new HttpClient();

export const ProductsLoader = {
    async getProduct({ params }: { params: Params }) {
        const productUrl = "http://localhost:4000/api/product";
        const { productId } = params;

        try {
            const response = await fetch(`${productUrl}/${productId}`);
            const product = await response.json();
            return product;
        } catch (e) {
            console.error(e);
        }
    },
};
