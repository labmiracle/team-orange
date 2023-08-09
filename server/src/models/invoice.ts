import { DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";

export interface InvoiceInterface {
    /**@IsInt */
    id?: number;
    date: Date;
    total: number;
    /**@IsInt */
    userId: number;
}

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class Invoice implements InvoiceInterface {
    id? = 0;
    date: Date = undefined;
    total = 0;
    userId = 0;
}
