/* eslint-disable @typescript-eslint/no-explicit-any */
import { Cart } from "../models/cart";
import { MySqlConnection } from "../core/mysql/mysql.connection";
import { DependencyContainer, DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";
import { EditRepositoryBase } from "../core/repositories/edit.repository";
import { format } from "mysql2";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class CartRepository extends EditRepositoryBase<Cart> {
    constructor(dependecyContainer: DependencyContainer, connection: MySqlConnection) {
        super(dependecyContainer, connection, Cart, "cart");
    }
    async insertItem(item: Cart) {
        const columns = Object.keys(item);
        const values = Object.values(item);
        const query = format(`INSERT INTO \`${this.tableName}\` (??) VALUES (?) ON DUPLICATE KEY UPDATE quantity=quantity+1`, [columns, values]);
        const [rows] = await this.connection.connection.execute(query);
        return rows;
    }
}
