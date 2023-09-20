import { Params } from "react-router-dom";
import { StoreService } from "../services/Store.service";
import { StoreType } from "../types";
/**
 * Fetch the store products, colors, managers
 * @param params url params
 * @returns store object {@link Types.StoreType}
 */

// const paradigm = new HttpClient();

export const StoresLoader = {
    async getStore({ params }: { params: Params<string> }) {
        const { storeId } = params;
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
        const names = await storeService.getNames();
        return names;
    },

    async getAllStores() {
        const storeService = new StoreService();
        const stores = await storeService.getAll();
        return stores;
    },

    async getByManagerId({ params }: { params: Params<string> }) {
        const storeService = new StoreService();
        const { managerId } = params;
        const data = await storeService.getByManager(Number(managerId));
        if (!data) throw new Error("store not found");
        return data;
    },
};
