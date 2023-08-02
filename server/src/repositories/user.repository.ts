import { DependencyContainer, DependencyLifeTime, Injectable } from "@miracledevs/paradigm-web-di";
import { EditRepositoryBase } from "../core/repositories/edit.repository";
import { User } from "../models/user";
import { MySqlConnection } from "../core/mysql/mysql.connection";
import bcrypt from "bcrypt";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class UserRepository extends EditRepositoryBase<User> {
    constructor(dependecyContainer: DependencyContainer, connection: MySqlConnection) {
        super(dependecyContainer, connection, User, "user");
    }
    async createAdmin() {
        const adminHashedPassword = bcrypt.hash("test1234", 10);
        const admin = {
            email: "admin@example.com",
            password: adminHashedPassword,
            name: "Test",
            lastName: "Admin",
            idDocumentType: "DNI",
            idDocumentNumber: 12312312,
            rol: "Admin",
        };
        const [rows] = await this.connection.connection.execute(`INSERT INTO \`${this.tableName}\` (?) VALUES (?)`, [Object.keys(admin), Object.values(admin)]);
        return rows;
    }
}
