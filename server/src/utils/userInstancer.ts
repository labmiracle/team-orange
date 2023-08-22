import { UserInterface } from "../models/user";
import { DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class UserAuth implements UserInterface {
    id? = 0;
    name = "";
    lastName = "";
    email = "";
    password? = "";
    idDocumentType = "";
    idDocumentNumber = 0;
    status? = 1;
    rol? = "";
}
