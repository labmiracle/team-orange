import { DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";
import { ProductInterface } from "./product";

export interface StoreInterface {
    /**@IsInt */
    id?: number;
    name: string;
    /**@IsInt */
    managerId: number;
    apiUrl: string;
    status?: number;
    colors?: {
        primary: {
            /**@IsInt */
            hue: number;
            /**@IsInt */
            sat: number;
            /**@IsInt */
            light: number;
        };
        secondary: {
            /**@IsInt */
            hue: number;
            /**@IsInt */
            sat: number;
            /**@IsInt */
            light: number;
        };
    };
    products?: {
        /** @IsInt */
        id?: number;
        name: string;
        description: string;
        price: number;
        discountPercentage: number;
        /** @IsInt */
        currentStock: number;
        /** @IsInt */
        reorderPoint: number;
        /** @IsInt */
        minimum: number;
        /** @IsInt */
        storeId?: number;
        categories: string[];
        sizes: string[];
        brand: string;
        url_img: string;
        /** @IsInt */
        status?: number;
    }[];
}

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class Store implements StoreInterface {
    id? = 0;
    name = "";
    managerId = 0;
    apiUrl = "";
    colors? = {
        primary: { hue: 0, sat: 0, light: 0 },
        secondary: { hue: 0, sat: 0, light: 0 },
    };
    products? = [] as ProductInterface[];
    status? = 1;
}

export interface ColorInterface {
    hue: number;
    sat: number;
    light: number;
}

export interface StoreColorInterface extends ColorInterface {
    id?: number;
    type: string;
    storeId: number;
}

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class StoreColor implements StoreColorInterface {
    id? = 0;
    type = "";
    hue = 0;
    sat = 0;
    light = 0;
    storeId = 0;
}
