import { Injectable, DependencyLifeTime } from "@miracledevs/paradigm-web-di";
import { IFilter, HttpContext, RoutingContext } from "@miracledevs/paradigm-express-webapi";
import jwt, { JwtPayload } from "jsonwebtoken";
import { MySqlConnection } from "../core/mysql/mysql.connection";
import { BatchDbCommand } from "../core/repositories/commands/batch.command";
import { RowDataPacket } from "mysql2/promise";
import { Response } from "express";

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class JWTAuthFilter implements IFilter {
    async beforeExecute(httpContext: HttpContext): Promise<void> {
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
    async afterExecute(httpContext: HttpContext): Promise<void> {
        const send = httpContext.response.send;
        httpContext.response.send = user => {
            httpContext.response.send = send;
            const token = jwt.sign({ ...user.data }, process.env.SHOPPY__ACCESS_TOKEN, { expiresIn: "1d" });
            httpContext.response.setHeader("x-auth", token);
            return send.call(httpContext.response, user) as Response;
        };
    }
}
//hacer un afterexecute

@Injectable({ lifeTime: DependencyLifeTime.Scoped })
export class isAdminFilter implements IFilter {
    protected batch: BatchDbCommand;
    constructor(protected readonly connection: MySqlConnection) {
        this.batch = new BatchDbCommand(connection);
    }

    async beforeExecute(httpContext: HttpContext): Promise<void> {
        const { id } = httpContext.request.body.decodedToken;
        const [rows] = await this.connection.connection.execute<RowDataPacket[]>("SELECT * FROM user WHERE id = ?", [id]);
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
        const { id } = httpContext.request.body.decodedToken;
        const [rows] = await this.connection.connection.execute<RowDataPacket[]>("SELECT * FROM user WHERE id = ?", [id]);
        if (rows[0].rol !== "Manager") throw new Error("Unauthorized");
    }
}
