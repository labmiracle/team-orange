import { useState } from "react";
// import { WebFetcher, HttpClient } from "@miracledevs/paradigm-web-fetch";
// const paradigm = new HttpClient();
// const fetcher = new WebFetcher();

// paradigm.setFetcher(fetcher);

type RegisterData = {
    email: string;
    password: string;
    name: string;
    lastname: string;
    docType: string;
    docNumber: number;
};

export function useLogin() {
    const [data, setData] = useState();
    function auth(email: string, password: string) {
        fetch("http://localhost:4000/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                password,
            }),
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(data => setData(data));
    }

    function register({ email, password, name, lastname, docType, docNumber }: RegisterData) {
        fetch("http://localhost:4000/api/users/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                password,
                name,
                lastName: lastname,
                idDocumentType: docType,
                idDocumentNumber: docNumber,
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (!data.error) {
                    auth(email, password);
                }
            });
    }

    return { data, auth, register };
}
