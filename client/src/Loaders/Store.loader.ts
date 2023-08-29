import { Params } from "react-router-dom";
import { StoreService } from "../services/Store.service";
import { StoreName, StoreType } from "../types";
/**
 * Fetch the store products, colors, managers
 * @param params url params
 * @returns store object {@link Types.StoreType}
 */

// const paradigm = new HttpClient();

export const StoresLoader = {
    async getStore({ params }: { params: Params }) {
        const storeId = params.id;
        try {
            if (Number(storeId)) {
                const storeService = new StoreService();
                const store = (await storeService.get(Number(storeId))) as StoreType;
                return store;
            }
        } catch (e) {
            return console.error((e as Error).message);
        }
    },

    async getStoresName() {
        const storeService = new StoreService();
        const names = (await storeService.getNames()) as StoreName[];
        return names;
    },
};
