import { Product } from "../models/product";
import { MySqlConnection } from "../core/mysql/mysql.connection";
import { DependencyContainer, DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";
import { EditRepositoryBase } from "../core/repositories/edit.repository";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class ProductRepository extends EditRepositoryBase<Product> {
    constructor(dependecyContainer: DependencyContainer, connection: MySqlConnection) {
        super(dependecyContainer, connection, Product, "product_view");
    }
}
