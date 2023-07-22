import { DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";

@Injectable({ lifeTime: DependencyLifeTime.Transient })
export class User {
    id? = 0;
    name = "";
    lastName = "";
    email = "";
    password? = "";
    idDocumentType = "";
    idDocumentNumber: 0;
    rol = "";
}
