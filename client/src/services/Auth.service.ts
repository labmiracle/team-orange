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
                const { name, rol, lastName } = decodeJwt(token);
                if (name && rol && lastName) {
                    return { token, name, rol, lastName } as AuthData;
                }
                throw new Error("Name, rol or lastName are undefined. Check token");
            }
            throw new Error("Token is undefined, check the headers or the endpoint");
        } catch (e) {
            console.log(e);
        }
    }

    async register({ email, password, name, lastName, docType, docNumber }: RegisterData) {
        console.log(email, password, name, lastName, docType, docNumber);
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
}
