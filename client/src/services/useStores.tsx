import { HttpClient } from "@miracledevs/paradigm-web-fetch";

const paradigm = new HttpClient();

const basePath = "http://localhost:4000/api/";

export async function getStore(id: string) {
    try {
        const store = await paradigm.get(`${basePath}/shop/${id}`);
        return store;
    } catch (e) {
        return console.error((e as Error).message);
    }
}

export async function getStoresName() {
    try {
        const storeNames = await paradigm.get(`${basePath}/shop/name`);
        return storeNames;
    } catch (e) {
        return console.error((e as Error).message);
    }
}
