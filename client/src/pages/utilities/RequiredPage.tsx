import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

export function RequiredPage({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();

    if (user) {
        return <Navigate to={"/"} />;
    }

    return children;
}
