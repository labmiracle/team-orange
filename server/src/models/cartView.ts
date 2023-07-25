import { DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";

export interface CartViewI {
    /**@IsInt */
    id: number;
    /**@IsInt */
    userId: number;
    /**@IsInt */
    productId: number;
    name: string;
    description: number;
    price: number;
    discountPercentage: number;
    storeId: number;
    url_img: string;
    brand: string;
    categories: string[];
    sizes: string[];
}

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class CartView implements CartViewI {
    id = 0;
    userId = 0;
    productId = 0;
    name = "";
    description = 0;
    price = 0;
    discountPercentage = 0;
    storeId = 0;
    url_img = "";
    brand = "";
    categories: string[] = [];
    sizes: string[] = [];
}
