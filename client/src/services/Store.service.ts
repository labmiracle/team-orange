import { baseEndpoints } from "../endpoints";
import Fetcher from "./Fetcher";
import { StoreType } from "../types/index";

export class StoreService {
    async getNames() {
        const response = await Fetcher.query(baseEndpoints.stores.names);
        const names = response.data as Omit<StoreType, "colors" | "products">;
        return names;
    }

    async getAll() {
        const response = await Fetcher.query(baseEndpoints.stores.get, { method: "GET" });
        const stores = response.data as Omit<StoreType, "colors" | "products">;
        return stores;
    }

    async get(storeId: number): Promise<StoreType> {
        const response = await Fetcher.query(baseEndpoints.stores.get + `/${storeId}`, { method: "GET" });
        const store = response.data as StoreType;
        return store;
    }

    async disable(storeId: number) {
        await Fetcher.query(baseEndpoints.stores.disable + `/${storeId}`, { method: "DELETE" });
    }

    async restore(storeId: number) {
        await Fetcher.query(baseEndpoints.stores.restore + `/${storeId}`, { method: "PUT" });
    }

    async update(store: StoreType) {
        await Fetcher.query(baseEndpoints.stores.update, { method: "PUT", data: store });
    }

    async create(store: Pick<StoreType, "name" | "managerId" | "apiUrl">): Promise<StoreType> {
        const response = await Fetcher.query(baseEndpoints.stores.create, { method: "POST", data: store });
        const storeCreated = response.data as StoreType;
        return storeCreated;
    }

    async delete(storeId: number) {
        await Fetcher.query(baseEndpoints.stores.delete + `/${storeId}`, { method: "DELETE" });
    }
}
