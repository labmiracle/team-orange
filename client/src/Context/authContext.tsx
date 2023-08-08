import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthData, User } from "../types";
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
    const [user, setUser] = useState<AuthData | null>(() => decodeUser() || null);

    return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
    const { user, setUser } = useContext(AuthContext);

    function logOut() {
        window.localStorage.removeItem("user");
        setUser(null);
    }

    return { user, setUser, logOut };
}
