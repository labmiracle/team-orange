import { Injectable, DependencyLifeTime } from "@miracledevs/paradigm-web-di";
import { IFilter, HttpContext } from "@miracledevs/paradigm-express-webapi";
import jwt, { JwtPayload } from "jsonwebtoken";
import { MySqlConnection } from "../core/mysql/mysql.connection";
import { BatchDbCommand } from "../core/repositories/commands/batch.command";
import { RowDataPacket } from "mysql2/promise";
import { User } from "../models/user";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class JWTAuthFilter implements IFilter {
    protected batch: BatchDbCommand;
    constructor(protected readonly connection: MySqlConnection) {
        this.batch = new BatchDbCommand(connection);
    }

    async beforeExecute(httpContext: HttpContext): Promise<void> {
        const token = httpContext.request.header("x-auth");
        if (!token) throw new Error("Token not found");
        const decodedToken = jwt.verify(token, process.env.SHOPPY__ACCESS_TOKEN) as JwtPayload;
        delete decodedToken.iat;
        delete decodedToken.exp;
        httpContext.request.headers["x-auth"] = JSON.stringify(decodedToken);
    }

    async afterExecute(httpContext: HttpContext): Promise<void> {
        const token = JSON.parse(httpContext.request.header("x-auth")) as User;
        const [rows] = await this.connection.connection.query<RowDataPacket[]>("SELECT * FROM user WHERE id = ?", [token.id]);
        if (rows.length === 0) {
            httpContext.response.removeHeader("x-auth");
        } else {
            delete rows[0].password;
            const token2 = jwt.sign({ ...rows[0] }, process.env.SHOPPY__ACCESS_TOKEN, { expiresIn: "1d" });
            httpContext.response.setHeader("x-auth", token2);
        }
    }
}

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class isAdminFilter implements IFilter {
    protected batch: BatchDbCommand;
    constructor(protected readonly connection: MySqlConnection) {
        this.batch = new BatchDbCommand(connection);
    }

    async beforeExecute(httpContext: HttpContext): Promise<void> {
        const { id } = JSON.parse(httpContext.request.header("x-auth"));
        const [rows] = await this.connection.connection.query<RowDataPacket[]>("SELECT * FROM user WHERE id = ?", [id]);
        if (rows[0].rol !== "Admin") throw new Error("Unauthorized");
    }
}

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class isManagerFilter implements IFilter {
    protected batch: BatchDbCommand;
    constructor(protected readonly connection: MySqlConnection) {
        this.batch = new BatchDbCommand(connection);
    }

    async beforeExecute(httpContext: HttpContext): Promise<void> {
        const { id } = JSON.parse(httpContext.request.header("x-auth"));
        const [rows] = await this.connection.connection.execute<RowDataPacket[]>("SELECT * FROM user WHERE id = ?", [id]);
        if (rows[0].rol !== "Manager") throw new Error("Unauthorized");
    }
}
