import type { Product } from "../types";
import { baseEndpoints } from "../endpoints";
import Fetcher from "./Fetcher";

export class CheckoutService {
    async getInvoices(token: string) {
        const response = await Fetcher.query(
					baseEndpoints.checkout.get,
					{
						method: "GET",
						token
					}
			);
			
			console.log(response)

        return response.data;
    }

    async produceInvoice(products: Product[]) {
        const response = await Fetcher.query(
            baseEndpoints.checkout.get,
            {
                method: "POST",
                data: products,
            }
        );

        return response.data;
    }
}
