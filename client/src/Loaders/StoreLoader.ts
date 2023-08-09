import { Params } from "react-router-dom";
// import { HttpClient } from "@miracledevs/paradigm-web-fetch";
/**
 * Fetch the store products, colors, managers
 * @param params url params
 * @returns store object {@link Types.StoreType}
 */

// const paradigm = new HttpClient();

export const StoresLoader = {
    async getStore({ params }: { params: Params }) {
        const storeUrl = "http://localhost:4000/api/shop";

        const storeId = params.id;
        try {
            if (storeId) {
                const response = await fetch(`${storeUrl}/${storeId}`);
                const store = await response.json();
                return store.data;
            }
        } catch (e) {
            return console.error((e as Error).message);
        }
    },

    async getStoresName() {
        const storeUrl = "http://localhost:4000/api/shop";
        const response = await fetch(`${storeUrl}/names`);
        const names = await response.json();
        return names.data;
    },
};
