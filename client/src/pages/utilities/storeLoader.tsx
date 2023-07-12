import { store1, store2, store3 } from "../stores";
import { StoreType } from "../../types/index.d";
import { Params } from "react-router-dom";
/**
 * Fetch the store products, colors, managers
 * @param params url params
 * @returns store object {@link Types.StoreType}
 */
export default async function storesLoader({ params }: { params: Params<string> }): Promise<StoreType> {
    const id = params.id;
    /* async function getProducts(storeNum: number) {
        try {
            const response = await fetch(`http://localhost:4000/stores/${storeNum}`);
            const products = await response.json();
            return products;
        } catch (e) {
            return console.error((e as Error).message);
        }
    } */
    const promise = new Promise<StoreType>((resolve, reject) => {
        if (!id) reject();

        if (id === "1") return resolve(store1);
        if (id === "2") return resolve(store2);
        if (id === "3") return resolve(store3);
    });
    return promise;
}
