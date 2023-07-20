import { HttpClient } from "@miracledevs/paradigm-web-fetch";
import { useEffect, useState } from "react";

export function useLogin() {
    const [data, setData] = useState();
    const isAuth = (username: string, password: string) => {
        fetch("https://dummyjson.com/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username,
                password,
            }),
        })
            .then(response => response.json())
            .then(data => setData(data));
    };

    return { data, isAuth };
}
