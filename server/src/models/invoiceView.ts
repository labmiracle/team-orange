import { DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";

export interface InvoiceViewI {
    /**@IsInt */
    id?: number;
    date: Date;
    total: number;
    /**@IsInt */
    userId: number;
    products: { name: string; store: string }[];
}

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class InvoiceView implements InvoiceViewI {
    id? = 0;
    date: Date = undefined;
    total = 0;
    userId = 0;
    products = [{ name: "", store: "" }];
}
