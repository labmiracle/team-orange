import { baseEndpoints } from "../endpoints";
import { Product, ProductResponse } from "../types";
import Fetcher from "./Fetcher";
export class ProductService {
    async getProduct(id: Product["id"]) {
        try {
            const product = await Fetcher.query(baseEndpoints.products.get + `/${id}`, {
                method: "GET",
            });
            return product.data;
        } catch (e) {
            console.error(e);
        }
    }
    async getAllProducts(storeId: number, pageNumber: number, productAmount: number) {
        try {
            const products = await Fetcher.query<Product[]>(
                baseEndpoints.products.getAll +
                    `/${storeId}
                ${pageNumber ? +`/q?page_number=${pageNumber}` : ""}
                ${pageNumber ? productAmount && `&product_amount=${productAmount}` : ""}
                `,
                {
                    method: "GET",
                }
            );

            return products.data;
        } catch (e) {
            console.log(
                baseEndpoints.products.getAll +
                    `/${storeId}
                ${pageNumber ? +`/q?page_number=${pageNumber}` : ""}
                ${pageNumber ? productAmount && `&product_amount=${productAmount}` : ""}`
            );
            console.error("hola", e);
        }
    }

    async getByFilter(storeId: number, page = 1, perPage = 12, size?: string, category?: string) {
        try {
            let url = `${baseEndpoints.products.getAll}/${storeId}/q?page=${page}&per_page=${perPage}`;
            if (size) {
                url += `&size=${size}`;
            }
            if (category) {
                url += `&category=${category}`;
            }
            const products = await Fetcher.query<ProductResponse>(url, { method: "GET" });
            return products.data;
        } catch (e) {
            console.error(e);
        }
    }
}
