import { DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";
import { Product } from "./product";

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class Store {
    id = 0;
    name = "";
    managerId = 0;
    apiUrl = "";
    colors = {
        primary: { hue: 0, sat: 0, light: 0 },
        secondary: { hue: 0, sat: 0, light: 0 },
    };
    products: Product[] = [];
}

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class StoreColor {
    id = 0;
    type = "";
    hue = 0;
    sat = 0;
    light = 0;
    storeId = 0;
}
