import { DependencyContainer, DependencyLifeTime, Injectable, ObjectType } from "@miracledevs/paradigm-web-di";
import { EditRepositoryBase } from "../core/repositories/edit.repository";
import { User } from "../models/user";
import { MySqlConnection } from "../core/mysql/mysql.connection";
import { UserAuth } from "../utils/userInstancer";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class UserRepository extends EditRepositoryBase<User, string> {
    constructor(dependecyContainer: DependencyContainer, connection: MySqlConnection) {
        super(dependecyContainer, connection, User, "user", "email");
    }
    setAuth(user: any, entityType: ObjectType<UserAuth>) {
        const entity = this.dependencyContainer.resolve(entityType);

        for (const key in user) {
            if (Object.prototype.hasOwnProperty.call(entity, key)) {
                (entity as any)[key] = user[key];
            }
        }

        return entity;
    }
    getAuth() {
        return this.dependencyContainer.resolve(UserAuth);
    }
    async getAllUsers() {
        const query = `SELECT id, name, lastName, email, idDocumentType, idDocumentNumber, rol, status, createdAt, updatedAt FROM \`${this.tableName}\``;
        const [rows] = await this.connection.connection.execute(query);
        return rows;
    }
}
