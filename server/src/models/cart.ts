import { DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";

export interface CartI {
    /**@IsInt */
    id?: number;
    /**@IsInt */
    userId: number;
    /**@IsInt */
    productId: number;
}

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class Cart implements CartI {
    id? = 0;
    userId = 0;
    productId = 0;
}
