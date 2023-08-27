import { DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";

export interface UserInterface {
    /**@IsInt */
    id?: number;
    name: string;
    lastName: string;
    email: string;
    password?: string;
    idDocumentType: string;
    /**@IsInt */
    idDocumentNumber: number;
    /**@IsInt */
    status?: number;
    rol?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class User implements UserInterface {
    id? = 0;
    name = "";
    lastName = "";
    email = "";
    password? = "";
    idDocumentType = "";
    idDocumentNumber = 0;
    status? = 1;
    rol? = "";
    createdAt?: Date;
    updatedAt?: Date;
    constructor() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}

export interface UserLoginInterface {
    email: string;
    password: string;
}

export interface AdminInterface extends UserInterface {
    rol: string;
}
