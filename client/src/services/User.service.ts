import type { RegisterData, User } from "../types";
import { baseEndpoints } from "../endpoints";
import Fetcher from "./Fetcher";
import { decodeJwt } from "jose";

export class UsersService {
    async login(email: User["email"], password: User["password"]) {
        const response = await Fetcher.query(baseEndpoints.users.login, {
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
        const response = await Fetcher.query<User>(baseEndpoints.users.update, {
            method: "PUT",
            data: user,
        });
        const token = response.headers["x-auth"];
        if (token) {
            if (response.data) {
                return response.data;
            }
            throw new Error("User not found");
        }
        throw new Error("Token is undefined, check the headers or the endpoint");
    }

    /**
     * GET an user with a given email
     * /q?email=example@email.com
     */
    async get(email: string) {
        const response = await Fetcher.query<User>(baseEndpoints.users.get + `/${email}`, {
            method: "GET",
        });
        return response.data;
    }

    /**
     * GET all users
     * Admin only
     */
    async getAll() {
        const response = await Fetcher.query<User[]>(baseEndpoints.users.get, {
            method: "GET",
        });
        return response.data;
    }

    /**
     * DISABLE an user
     * Admin only
     */
    async disable(user: User) {
        const response = await Fetcher.query<User>(baseEndpoints.users.disable, {
            method: "DELETE",
            data: user,
        });
        return response.data;
    }

    /**
     * RESTORE an user
     * Admin only
     */
    async restore(user: User) {
        const response = await Fetcher.query<User>(baseEndpoints.users.restore, {
            method: "PUT",
            data: user,
        });
        return response.data;
    }

    /**
     * DELETE an user
     * Admin only
     */
    async delete(user: User) {
        const response = await Fetcher.query<User>(baseEndpoints.users.delete, {
            method: "DELETE",
            data: user,
        });
        return response.data;
    }

    /**
     * CHANGE ROLES to manager
     * Admin only
     * @param email :user email
     * @param idStore: store id
     */
    async changeRoleManager({ email, idStore }: { email: string; idStore: number }) {
        const response = await Fetcher.query(baseEndpoints.users.changeRoleManager, {
            method: "PUT",
            data: { email, idStore },
        });
        return response.data;
    }

    /**
     * CHANGE ROLES to client
     * Admin only
     * @param email :user email
     * @param idStore: store id
     */
    async changeRoleClient({ email }: { email: string }) {
        const response = await Fetcher.query(baseEndpoints.users.changeRoleClient, {
            method: "PUT",
            data: { email },
        });
        return response.data;
    }
}
