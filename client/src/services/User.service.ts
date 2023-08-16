import type { LoaderResponse, RegisterData, User } from "../types";
import { baseEndpoints } from "../endpoints";
import { AxiosResponse } from "axios";
import Fetcher from "./Fetcher";
import { decodeJwt } from "jose";

export class UsersService {
    async login(email: User["email"], password: User["password"]) {
        const response = await Fetcher.query<AxiosResponse<LoaderResponse<User>>>(`${baseEndpoints.users.login}`, {
            method: "POST",
            data: {
                email,
                password,
            },
        });
        const token = response.headers["x-auth"];
        if (!token) throw new Error("Token not found");
        window.localStorage.setItem("user", token);
        const user = decodeJwt(token);
        if (user.name && user.rol && user.lastName) {
            return user as User;
        }
        throw new Error("Name, rol or lastName are undefined. Check token");
    }

    async register({ email, password, name, lastName, docType, docNumber }: RegisterData) {
        const response = await Fetcher.query<AxiosResponse<LoaderResponse<User>>>(baseEndpoints.users.register, {
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
        const response = await Fetcher.query<AxiosResponse<LoaderResponse<User>>>(baseEndpoints.users.update, {
            method: "PUT",
            data: user,
        });
        const token = response.headers["x-auth"];
        if (!token) throw new Error("Token no found");
        window.localStorage.setItem("user", token);
        if (response.data.error) throw new Error("User not found");
        const userResponse = response.data.data;
        return userResponse;
    }

    async getUser(id: number) {
        const response = await Fetcher.query<AxiosResponse<LoaderResponse<User>>>(`${baseEndpoints.users}/${id}`, {
            method: "GET",
        });
        return response.data;
    }
}
