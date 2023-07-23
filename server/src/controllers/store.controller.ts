import { Action, ApiController, Controller } from "@miracledevs/paradigm-express-webapi";
import { StoreRepository } from "../repositories/store.repository";
import { ProductRepository } from "../repositories/product.repository";
import { StoreColorRepository } from "../repositories/storeColor.repository";
import { Store } from "../models/store";

type Colors = {
    primary: { hue: number; sat: number; light: number };
    secondary: { hue: number; sat: number; light: number };
};

@Controller({ route: "/api/shop" })
export class StoreController extends ApiController {
    constructor(private storeRepo: StoreRepository, private productRepo: ProductRepository, private storeColorRepo: StoreColorRepository) {
        super();
    }

    @Action({ route: "/names" })
    async getAll() {
        try {
            const store = await this.storeRepo.getBy("name");
            return store;
        } catch (err) {
            console.error(err);
        }
    }

    @Action({ route: "/:storeId" })
    async getById(storeId: number): Promise<Store> {
        try {
            const store = await this.storeRepo.getById(Number(storeId));
            const products = await this.productRepo.find("storeId", Number(storeId));
            const colorsResponse = await this.storeColorRepo.find("storeId", Number(storeId));
            const colorsObj: Colors = {} as Colors;
            for (const color of colorsResponse) {
                const type = color.type.toLowerCase();
                colorsObj[type as keyof Colors] = { hue: color.hue, sat: color.sat, light: color.light };
            }
            return { ...store, products: products, colors: colorsObj };
        } catch (err) {
            console.error(err);
        }
    }
}
