import { DependencyContainer, DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";
import { EditRepositoryBase } from "../core/repositories/edit.repository";
import { Store } from "../models/store";
import { MySqlConnection } from "../core/mysql/mysql.connection";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class StoreRepository extends EditRepositoryBase<Store> {
    constructor(dependecyContainer: DependencyContainer, connection: MySqlConnection) {
        super(dependecyContainer, connection, Store, "store");
    }
}
