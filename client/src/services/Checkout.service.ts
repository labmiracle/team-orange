import type { LoaderResponse, RegisterData, User, InvoiceInterface, Product } from "../types";
import { baseEndpoints } from "../endpoints";
import { AxiosResponse } from "axios";
import Fetcher from "./Fetcher";

export class CheckoutService {
    async getInvoices() {
        const response = await Fetcher.query<AxiosResponse<LoaderResponse<InvoiceInterface[]>>>(
            baseEndpoints.checkout.get,
            {
                method: "GET",
            }
        );

        return response.data;
    }

    async produceInvoice(products: Product[]) {
        const response = await Fetcher.query<AxiosResponse<LoaderResponse<InvoiceInterface>>>(
            baseEndpoints.checkout.get,
            {
                method: "POST",
                data: products,
            }
        );

        return response.data;
    }
}
