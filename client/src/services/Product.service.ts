import { baseEndpoints } from "../endpoints";
import { Product } from "../types";
import Fetcher from "./Fetcher";
export class ProductService {
    async getProduct(id: Product["id"]) {
        try {
            const product = await Fetcher.query(`${baseEndpoints.products.product}/${id}`, {
                method: "GET",
            });
            return product.data;
        } catch (e) {
            console.log(e);
        }
    }
}
