import { baseEndpoints } from "../endpoints";
import { Product } from "../types";
import axios from "axios";

export class ProductService {
    static async getProduct(id: Product["id"]) {
        try {
            const product = await axios.get(`${baseEndpoints.products}/${id}`);
            return product.data;
        } catch (e) {
            console.log(e);
        }
    }
}
