import { Brand } from "../models/product.addons";
import { MySqlConnection } from "../core/mysql/mysql.connection";
import { DependencyContainer, DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";
import { EditRepositoryBase } from "../core/repositories/edit.repository";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class BrandRepository extends EditRepositoryBase<Brand> {
    constructor(dependecyContainer: DependencyContainer, connection: MySqlConnection) {
        super(dependecyContainer, connection, Brand, "brand");
    }
}
