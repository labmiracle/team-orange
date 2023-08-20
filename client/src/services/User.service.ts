import type { AuthData, RegisterData, User } from "../types";
import { baseEndpoints } from "../endpoints";
import Fetcher from "./Fetcher";
import { decodeJwt } from "jose";

export class UsersService {
    async login(email: User["email"], password: User["password"]) {
        try {
            const response = await Fetcher.query(`${baseEndpoints.users.login}`, {
                method: "POST",
                data: {
                    email,
                    password,
                },
            });
            const token = response.headers["x-auth"];
            if (token) {
                window.localStorage.setItem("user", token);
                const user = decodeJwt(token);
                if (user) {
                    return user as User;
                }
                throw new Error("Name, rol or lastName are undefined. Check token");
            }
            throw new Error("Token is undefined, check the headers or the endpoint");
        } catch (e) {
            console.log(e);
        }
    }

    async register({ email, password, name, lastName, docType, docNumber }: RegisterData) {
        const response = await Fetcher.query(baseEndpoints.users.register, {
            method: "POST",
            data: {
                email,
                password,
                name,
                lastName,
                idDocumentType: docType,
                idDocumentNumber: docNumber,
            },
        });
        const httpStatus = response.status;
        return httpStatus;
    }

    async update(user: User) {
        const response = await Fetcher.query(baseEndpoints.users.update, {
            method: "PUT",
            data: user,
        });
        const token = response.headers["x-auth"];
        if (token) {
            if (response.data) {
                const userResponse = response.data;
                return userResponse;
            }
            throw new Error("User not found");
        }
        throw new Error("Token is undefined, check the headers or the endpoint");
    }

    /**
     * GET an user with a given email
     * /q?email=example@email.com
     * Admin only
     */
    async getUser(email: string) {
        const response = await Fetcher.query(`${baseEndpoints.users}/${email}`, {
            method: "GET",
        });
        return response.data;
    }

    /**
     * GET all users
     * Admin only
     */
    async getAllUsers() {
        const response = await Fetcher.query(`${baseEndpoints.users}`, {
            method: "GET",
        });
        return response.data;
    }
}
