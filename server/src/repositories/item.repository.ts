/* eslint-disable @typescript-eslint/no-explicit-any */
import { Item } from "../models/item";
import { MySqlConnection } from "../core/mysql/mysql.connection";
import { DependencyContainer, DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";
import { EditRepositoryBase } from "../core/repositories/edit.repository";
import { format } from "mysql2";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class ItemRepository extends EditRepositoryBase<Item> {
    constructor(dependecyContainer: DependencyContainer, connection: MySqlConnection) {
        super(dependecyContainer, connection, Item, "item");
    }
    async insertItem(items: Item[]) {
        const values = items.map(item => Object.values(item));
        const columns = Object.keys(items[0]);
        const query = format(`INSERT INTO \`${this.tableName}\` (??) VALUES ? ON DUPLICATE KEY UPDATE quantity=quantity+1`, [columns, values]);
        console.log(query);
        const [rows] = await this.connection.connection.execute(query);
        return rows;
    }
}
