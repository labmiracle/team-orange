import { Injectable, DependencyLifeTime } from "@miracledevs/paradigm-web-di";
import { IFilter, HttpContext } from "@miracledevs/paradigm-express-webapi";
import jwt, { JwtPayload } from "jsonwebtoken";
import { MySqlConnection } from "../core/mysql/mysql.connection";
import { BatchDbCommand } from "../core/repositories/commands/batch.command";
import { RowDataPacket } from "mysql2/promise";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class JWTAuth implements IFilter {
    async beforeExecute(httpContext: HttpContext) {
        const token = httpContext.request.header("x-auth");
        if (!token) throw new Error("Token not found");
        const decodedToken = jwt.verify(token, process.env.SHOPPY__ACCESS_TOKEN) as JwtPayload;
        delete decodedToken.iat;
        delete decodedToken.exp;
        httpContext.request.body = {
            entity: httpContext.request.body,
            decodedToken: decodedToken,
        };
    }
}

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class isAdmin implements IFilter {
    protected batch: BatchDbCommand;
    constructor(protected readonly connection: MySqlConnection) {
        this.batch = new BatchDbCommand(connection);
    }

    async beforeExecute(httpContext: HttpContext) {
        const { id } = httpContext.request.body.decodedToken;
        const [rows] = await this.connection.connection.execute<RowDataPacket[]>("SELECT * FROM user WHERE id = ?", [id]);
        if (rows[0].rol !== "Admin") throw new Error("Unauthorized");
    }
}

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class isManager implements IFilter {
    protected batch: BatchDbCommand;
    constructor(protected readonly connection: MySqlConnection) {
        this.batch = new BatchDbCommand(connection);
    }

    async beforeExecute(httpContext: HttpContext) {
        const { id } = httpContext.request.body.decodedToken;
        const [rows] = await this.connection.connection.execute<RowDataPacket[]>("SELECT * FROM user WHERE id = ?", [id]);
        if (rows[0].rol !== "Manager") throw new Error("Unauthorized");
    }
}
