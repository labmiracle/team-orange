import React, { createContext, useContext, useState } from "react";

interface contextType {
    user: boolean | null;
    setUser: React.Dispatch<React.SetStateAction<boolean | null>>;
}
const AuthContext = createContext<contextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<boolean | null>(null);

    return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const authContext = useContext(AuthContext);

    if (authContext) {
        const { user, setUser } = authContext;

        return { user, setUser };
    } else {
        throw new Error("You have to wrap your app with AuthProvider");
    }
}
