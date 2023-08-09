import { DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";

export interface ItemInterface {
    /**@IsInt */
    id?: number;
    /**@IsInt */
    quantity: number;
    total: number;
    unitPrice: number;
    /**@IsInt */
    productId: number;
    /**@IsInt */
    invoiceId: number;
}

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class Item implements ItemInterface {
    id? = 0;
    quantity = 0;
    total = 0;
    unitPrice = 0;
    productId = 0;
    invoiceId = 0;
}
