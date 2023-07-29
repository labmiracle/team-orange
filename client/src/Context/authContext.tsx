import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthData, User } from "../types/types";
import { decodeJwt } from "jose";

interface ContextType {
    user: AuthData | null;
    setUser: React.Dispatch<React.SetStateAction<AuthData | null>>;
}
export const AuthContext = createContext<ContextType>({ user: {} as AuthData, setUser: () => ({}) as AuthData });

function decodeUser() {
    try {
        const token = window.localStorage.getItem("user");
        if (token) {
            const payload = decodeJwt(token) as User;
            return { token, rol: payload.rol, name: payload.name, lastname: payload.lastName };
        }
    } catch (err) {
        console.error(err);
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthData | null>(decodeUser() || null);

    /* 
    useEffect(() => {
        try {
            const token = window.localStorage.getItem("user");
            if (token && token !== "undefined") {
                const payload = decodeJwt(token) as User;
                setUser({ token, rol: payload.rol, name: payload.name, lastname: payload.lastName });
            }
        } catch (err) {
            console.error(err);
        }
    }, []); */

    return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
    const { user, setUser } = useContext(AuthContext);

    function logOut() {
        window.localStorage.removeItem("user");
        setUser(null);
    }

    return { user, setUser, logOut };
    /* if (authContext) {
        const { user, setUser } = authContext;

       

        return { user, setUser };
    } else {
        throw new Error("You have to wrap your app with AuthProvider");
    } */
}
