import { Action, ApiController, Controller, HttpMethod } from "@miracledevs/paradigm-express-webapi";
import { UserRepository } from "../repositories/user.repository";
import { Response } from "express";
import { User } from "../models/user";
import { UserFilter } from "../filters/user.filter";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

@Controller({ route: "/api/users" })
export class UserController extends ApiController {
    constructor(private userRepo: UserRepository) {
        super();
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
            return this.httpContext.response.status(404).json({
                message: "Users not found",
                data: null,
                error: true,
            });
        }
    }

    @Action({ route: "/email", method: HttpMethod.GET })
    async getByEmail(): Promise<Response> {
        try {
            const { email } = this.httpContext.request.query;
            const user = await this.userRepo.find("email", email);
            return this.httpContext.response.status(200).json({
                message: "User found",
                data: user,
                error: false,
            });
        } catch (error) {
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
            const user = await this.userRepo.getById(id);
            user.status = 0;
            const userDeleted = await this.userRepo.update(user);
            return this.httpContext.response.status(200).json({
                message: "User deleted",
                data: userDeleted,
                error: false,
            });
        } catch (error) {
            return this.httpContext.response.status(404).json({
                message: "User not found",
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
            return this.httpContext.response.status(404).json({
                message: "User " + error.message,
                data: null,
                error: true,
            });
        }
    }

    @Action({ route: "/", filters: [UserFilter], fromBody: true, method: HttpMethod.POST })
    async post(user: User): Promise<Response> {
        try {
            user.password = await bcrypt.hash(user.password, 10);
            await this.userRepo.insertOne(user);
            delete user.password;
            const token = jwt.sign(user, process.env.SHOPPY__ACCESS_TOKEN, { expiresIn: "30d" });
            this.httpContext.response.cookie("token", token, { httpOnly: true });
            return this.httpContext.response.status(201).json({
                message: "User created",
                data: user,
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

    @Action({ route: "/login", fromBody: true, method: HttpMethod.POST })
    async login(user: User): Promise<Response> {
        try {
            const [userdb] = await this.userRepo.find("email", user.email);
            if (!userdb) {
                return this.httpContext.response.status(401).json({
                    message: "Incorrect username or password",
                    data: undefined,
                    error: true,
                });
            }
            const isPasswordValid = await bcrypt.compare(user.password, userdb.password);
            if (!isPasswordValid) {
                return this.httpContext.response.status(401).json({
                    message: "Incorrect username or password",
                    data: undefined,
                    error: true,
                });
            }
            const token = jwt.sign(user, process.env.SHOPPY__ACCESS_TOKEN, { expiresIn: "30d" });
            this.httpContext.response.cookie("token", token, { httpOnly: true });
            return this.httpContext.response.status(200).json({
                message: "Login successful",
                data: userdb,
                error: false,
            });
        } catch (error) {
            console.log(error.message);
            return this.httpContext.response.status(404).json({
                message: "Users not found",
                data: null,
                error: true,
            });
        }
    }
}
