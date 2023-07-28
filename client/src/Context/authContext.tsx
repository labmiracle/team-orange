import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthData, User } from "../types/types";
import { decodeJwt } from "jose";

interface ContextType {
    user: AuthData | null;
    setUser: React.Dispatch<React.SetStateAction<AuthData | null>>;
}
export const AuthContext = createContext<ContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthData | null>(null);

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
    }, []);

    return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
    const authContext = useContext(AuthContext);

    if (authContext) {
        const { user, setUser } = authContext;

        return { user, setUser };
    } else {
        throw new Error("You have to wrap your app with AuthProvider");
    }
}
