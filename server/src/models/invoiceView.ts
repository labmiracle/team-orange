import { DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";

interface Product {
    name: string;
    store: string;
}

export interface InvoiceViewI {
    /**@IsInt */
    id?: number;
    date: Date;
    total: number;
    /**@IsInt */
    userId: number;
    products: Product[];
}

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class InvoiceView implements InvoiceViewI {
    id? = 0;
    date: Date = undefined;
    total = 0;
    userId = 0;
    products: Product[] = [];
}
