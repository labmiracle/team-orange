import type { InvoiceInterface, Product } from "../types";
import { baseEndpoints } from "../endpoints";
import Fetcher from "./Fetcher";

export class CheckoutService {
    async getInvoices() {
        const response = await Fetcher.query(baseEndpoints.checkout.get, {
            method: "GET",
        });

        return response.data;
    }

    async produceInvoice(products: Product[]): Promise<InvoiceInterface> {
        try {
            const response = await Fetcher.query<InvoiceInterface>(baseEndpoints.checkout.produce, {
                method: "POST",
                data: products,
            });
            return response.data;
        } catch (e) {
            throw Error((e as Error).message)
        }
    }
}
