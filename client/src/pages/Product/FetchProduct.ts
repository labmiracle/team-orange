import { Params } from "react-router-dom";
import { store1, store2, store3 } from "../stores";

export async function FetchProduct({ params }: { params: Params }) {
    const { id, productId } = params;

    return new Promise((resolve, reject) => {
        if (!id) reject();

        if (id === "1") return resolve(store1.products.find(product => product.id === Number(productId)));
        if (id === "2") return resolve(store2.products.find(product => product.id === Number(productId)));
        if (id === "3") return resolve(store3.products.find(product => product.id === Number(productId)));
    });
}
