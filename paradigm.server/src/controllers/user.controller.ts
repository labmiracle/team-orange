import { Action, ApiController, Controller, HttpMethod } from "@miracledevs/paradigm-express-webapi";
import { UserRepository } from "../repositories/user.repository";
import { QueryError } from "mysql2";
import { Response } from "express";
import { User } from "../models/user";
import { UserFilter } from "../filters/user.filter";

@Controller({ route: "/api/users" })
export class UserController extends ApiController {
    constructor(private userRepo: UserRepository) {
        super();
    }

    @Action({ route: "/email", method: HttpMethod.GET })
    async getByEmail(): Promise<Response> {
        try {
            const { email } = this.httpContext.request.query;
            console.log(email);
            const user = await this.userRepo.find("email", email);
            return this.httpContext.response.status(200).json({
                message: "User found",
                data: user,
                error: false,
            });
        } catch (error) {
            const { name, message } = error as QueryError;
            console.error(name + ": " + message);
            return this.httpContext.response.status(404).json({
                message: "User not found",
                data: null,
                error: true,
            });
        }
    }

    @Action({ route: "/:id", method: HttpMethod.GET })
    async getById(id: number): Promise<Response> {
        try {
            const user = await this.userRepo.getById(Number(id));
            return this.httpContext.response.status(200).json({
                message: "User found",
                data: user,
                error: false,
            });
        } catch (error) {
            const { name, message } = error as QueryError;
            console.error(name + ": " + message);
            return this.httpContext.response.status(404).json({
                message: "User not found",
                data: null,
                error: true,
            });
        }
    }

    @Action({ route: "/:id", method: HttpMethod.DELETE })
    async delete(id: number): Promise<Response> {
        try {
            await this.userRepo.delete(Number(id));
            return this.httpContext.response.status(200).json({
                message: "User deleted",
                data: null,
                error: false,
            });
        } catch (error) {
            const { name, message } = error as QueryError;
            console.error(name + ": " + message);
            return this.httpContext.response.status(404).json({
                message: "User not found",
                data: null,
                error: true,
            });
        }
    }
    //error: Also updates
    @Action({ route: "/", filters: [UserFilter], fromBody: true, method: HttpMethod.POST })
    async post(user: User): Promise<Response> {
        try {
            const result = await this.userRepo.insertOne(user);
            return this.httpContext.response.status(201).json({
                message: "User created",
                data: result,
                error: false,
            });
        } catch (error) {
            let message = "Failed to create user";
            if (error.code === "ER_DUP_ENTRY" && error.sqlMessage.includes("email")) {
                message = "Email already exists";
            } else if (error.code === "ER_DUP_ENTRY" && error.sqlMessage.includes("idDocumentNumber")) {
                message = "ID document number already exists";
            }
            return this.httpContext.response.status(404).json({
                message: message,
                data: null,
                error: true,
            });
        }
    }

    @Action({ route: "/", filters: [UserFilter], fromBody: true, method: HttpMethod.PUT })
    async update(user: User): Promise<Response> {
        try {
            const result = await this.userRepo.update(user);
            return this.httpContext.response.status(201).json({
                message: "User created",
                data: result,
                error: false,
            });
        } catch (error) {
            console.error("User " + error.message);
            return this.httpContext.response.status(404).json({
                message: "User " + error.message,
                data: null,
                error: true,
            });
        }
    }

    @Action({ route: "/", method: HttpMethod.GET })
    async getAll(): Promise<Response> {
        try {
            const users = await this.userRepo.getAll();
            return this.httpContext.response.status(200).json({
                message: "Users found",
                data: users,
                error: false,
            });
        } catch (error) {
            const { name, message } = error as QueryError;
            console.error(name + ": " + message);
            return this.httpContext.response.status(404).json({
                message: "Users not found",
                data: null,
                error: true,
            });
        }
    }
}
