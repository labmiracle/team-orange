import { baseEndpoints } from "../endpoints";
import { Product, LoaderResponse } from "../types";
import { AxiosResponse } from "axios";
import Fetcher from "./Fetcher";
export class ProductService {
    async getProduct(id: Product["id"]) {
        try {
            const product = await Fetcher.query<AxiosResponse<LoaderResponse<Product>>>(
                `${baseEndpoints.products.product}/${id}`,
                {
                    method: "GET",
                }
            );
            return product.data;
        } catch (e) {
            console.log(e);
        }
    }
}
