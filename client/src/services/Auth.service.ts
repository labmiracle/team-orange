import type { AuthData, LoaderResponse, RegisterData, User } from "../types";
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
        if (token) {
            const { name, rol, lastName } = decodeJwt(token);
            if (name && rol && lastName) {
                return { token, name, rol, lastName } as AuthData;
            }
            throw new Error("Name, rol or lastName are undefined. Check token");
        }
        throw new Error("Token is undefined, check the headers or the endpoint");
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
}
