import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../Context/AuthContext";

export function RequiredPage({ children }: { children: React.ReactNode }) {
    const { user } = useAuthContext();

    if (user) {
        return <Navigate to={"/"} />;
    }

    return children;
}
