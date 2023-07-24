/**
 * Fetch the store products, colors, managers
 * @param params url params
 * @returns store object {@link Types.StoreType}
 */

export interface StoreName {
    id: number;
    name: string;
}

export default async function storesNamesLoader(): Promise<StoreName[] | void> {
    try {
        const response = await fetch(`http://localhost:4000/api/shop/names`);
        const names = await response.json();
        return names;
    } catch (e) {
        return console.error((e as Error).message);
    }

    /* const promise = new Promise<StoreType>((resolve, reject) => {
        if (!id) reject();

        if (id === "1") return resolve(store1);
        if (id === "2") return resolve(store2);
        if (id === "3") return resolve(store3);
    });
    return promise; */
}
