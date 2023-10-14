import React, { createContext, useContext, useState } from "react";
import { User } from "../types";
import { decodeJwt } from "jose";

interface ContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}
export const AuthContext = createContext<ContextType>({ user: {} as User, setUser: () => ({}) as User });

function decodeUser() {
    try {
        const token = window.localStorage.getItem("user");
        if (token) {
            const user = decodeJwt(token) as User;
            return user;
        }
    } catch (err) {
        console.error(err);
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(() => decodeUser() || null);

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
