import React, { createContext, useContext, useState } from "react";
import { AuthData } from "../types/types";

interface ContextType {
    user: AuthData | null;
    setUser: React.Dispatch<React.SetStateAction<AuthData | null>>;
}
const AuthContext = createContext<ContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthData | null>(null);

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
