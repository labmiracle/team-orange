import { baseEndpoints } from "../endpoints";
import { Product, ProductResponse } from "../types";
import Fetcher from "./Fetcher";
type FilterProps = {
    storeId: number;
    page?: number;
    perPage?: number;
    size?: string | null;
    category?: string | null;
};

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
            console.error(e);
        }
    }

    async getByFilter({ storeId, page = 1, perPage = 12, size, category }: FilterProps) {
        try {
            const urlParamsArray: string[] = [];
            page && urlParamsArray.push(`page=${page}`);
            perPage && urlParamsArray.push(`per_page=${perPage}`);
            size && urlParamsArray.push(`size=${size}`);
            category && urlParamsArray.push(`category=${category}`);
            const urlParams = "?" + urlParamsArray.join("&");
            const url = `${baseEndpoints.products.getAll}/${storeId}/q${urlParams}`;
            const products = await Fetcher.query<ProductResponse>(url, { method: "GET" });
            return products.data;
        } catch (e) {
            console.error(e);
        }
    }

    async post(products: Product[]) {
        try {
            const url = `${baseEndpoints.products.get}`;
            const productsResponse = await Fetcher.query<ProductResponse>(url, {
                method: "POST",
                data: products,
            });
            return productsResponse.data;
        } catch (e) {
            console.error(e);
        }
    }

    async disable(id: number) {
        try {
            await Fetcher.query(`${baseEndpoints.products.get}/${id}`, { method: "DELETE" });
        } catch (e) {
            console.error(e);
        }
    }

    async update(product: Product) {
        try {
            await Fetcher.query(`${baseEndpoints.products.get}`, { method: "PUT", data: product });
        } catch (e) {
            console.error(e);
        }
    }
}
