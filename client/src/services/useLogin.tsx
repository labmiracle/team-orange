import { useState } from "react";
import { JWTPayload, decodeJwt } from "jose";
import { AuthData, User } from "../types";
import { useAuthContext } from "../Context/AuthContext";

// import { WebFetcher, HttpClient } from "@miracledevs/paradigm-web-fetch";
// const paradigm = new HttpClient();
// const fetcher = new WebFetcher();

// paradigm.setFetcher(fetcher);

type RegisterData = {
    email: string;
    password: string;
    name: string;
    lastName: string;
    docType: string;
    docNumber: number;
};

export function useLogin() {
    const { user, setUser } = useAuthContext();

    function getAuth(email: string, password: string) {
        fetch("http://localhost:4000/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                password,
            }),
        }).then(response => {
            if (response.ok) {
                const token = response.headers.get("x-auth");
                if (token) {
                    const {name, rol , lastName} = decodeJwt(token) as User;
                    setUser({ token, rol, name, lastName });
                    window.localStorage.setItem("user", token);
                }
            }
        });
    }

    function register({ email, password, name, lastName, docType, docNumber }: RegisterData) {
        fetch("http://localhost:4000/api/users/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                password,
                name,
                lastName,
                idDocumentType: docType,
                idDocumentNumber: docNumber,
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (!data.error) {
                    getAuth(email, password);
                }
            });
    }

    return { user, getAuth, register };
}
