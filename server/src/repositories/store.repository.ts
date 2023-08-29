/* eslint-disable @typescript-eslint/no-explicit-any */
import { DependencyContainer, DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";
import { EditRepositoryBase } from "../core/repositories/edit.repository";
import { Store } from "../models/store";
import { MySqlConnection } from "../core/mysql/mysql.connection";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class StoreRepository extends EditRepositoryBase<Store> {
    constructor(dependecyContainer: DependencyContainer, connection: MySqlConnection) {
        super(dependecyContainer, connection, Store, "store");
    }

    async getNames() {
        const query = `SELECT id, name, managerId, status, apiUrl FROM \`${this.tableName}\` WHERE status = 1 `;
        const [rows] = await this.connection.connection.execute(query);
        return rows;
    }
}
