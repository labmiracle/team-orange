import { AxiosResponse } from "axios";
import { baseEndpoints } from "../endpoints";
import { LoaderResponse, StoreType, StoreName } from "../types";
import Fetcher from "./Fetcher";

export class StoreService {
    async getStoreNames() {
        try {
            const response = await Fetcher.query<AxiosResponse<LoaderResponse<StoreName>>>(baseEndpoints.stores.names, {
                method: "GET",
            });
            const names = response.data.data;
            return names;
        } catch (error) {
            console.log(error);
        }
    }

    async getStore(storeId: number) {
        try {
            const response = await Fetcher.query<AxiosResponse<LoaderResponse<StoreType>>>(
                `${baseEndpoints.stores.store}/${storeId}`,
                {
                    method: "GET",
                }
            );

            const store = response.data.data;

            return store;
        } catch (error) {
            console.log(error);
        }
    }
}
