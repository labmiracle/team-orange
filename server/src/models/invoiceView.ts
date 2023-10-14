import { DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";

export interface InvoiceViewInterface {
    /**@IsInt */
    id?: number;
    date: Date;
    total: number;
    name: string;
    lastName: string;
    email: string;
    idDocumentType: string;
    /**@IsInt */
    idDocumentNumber: number;
    products: {
        name: string;
        store: string;
        price: number;
        /**@IsInt */
        quantity: number;
        total: number;
    }[];
}

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class InvoiceView implements InvoiceViewInterface {
    id? = 0;
    date: Date = undefined;
    total = 0;
    userId = 0;
    name = "";
    lastName = "";
    email = "";
    idDocumentType = "";
    idDocumentNumber = 0;
    products = [
        {
            name: "",
            store: "",
            price: 0,
            quantity: 0,
            total: 0,
        },
    ];
}
