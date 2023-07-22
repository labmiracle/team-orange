import { ProductDB } from "../models/product";
import { MySqlConnection } from "../core/mysql/mysql.connection";
import { DependencyContainer, DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";
import { EditRepositoryBase } from "../core/repositories/edit.repository";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class ProductDBRepository extends EditRepositoryBase<ProductDB> {
    constructor(dependecyContainer: DependencyContainer, connection: MySqlConnection) {
        super(dependecyContainer, connection, ProductDB, "product");
    }
}
