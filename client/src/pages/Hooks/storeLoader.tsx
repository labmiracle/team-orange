import { store1, store2, store3 } from "../stores";
import { StoreType } from "../types";
/**
 * Fetch the store products
 * @param id store id number
 * @returns products array
 */
export default function storesLoader(id: string): StoreType | undefined {
    /* async function getProducts(storeNum: number) {
        try {
            const response = await fetch(`http://localhost:4000/stores/${storeNum}`);
            const products = await response.json();
            return products;
        } catch (e) {
            return console.error((e as Error).message);
        }
    } */
    if (!id) return;
    if (id === "1") return store1;
    if (id === "2") return store2;
    if (id === "3") return store3;
}
