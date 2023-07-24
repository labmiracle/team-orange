import { DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";

export interface UserI {
    /**@IsInt */
    id?: number;
    name: string;
    lastName: string;
    email: string;
    password?: string;
    idDocumentType: string;
    /**@IsInt */
    idDocumentNumber: number;
    rol: string;
    /**@IsInt */
    status: number;
}

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class User implements UserI {
    id? = 0;
    name = "";
    lastName = "";
    email = "";
    password? = "";
    idDocumentType = "";
    idDocumentNumber = 0;
    rol = "";
    status = 1;
}

export interface UserL {
    email: string;
    password: string;
}
