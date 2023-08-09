import { baseEndpoints } from "../endpoints";
import { Product } from "../types";
import fetcher from "./Fetcher";
export class ProductService {
    async getProduct(id: Product["id"]) {
        try {
            const product = await fetcher.query(`${baseEndpoints.products}/${id}`);
            console.log(product);
            return product.data;
        } catch (e) {
            console.log(e);
        }
    }
}
