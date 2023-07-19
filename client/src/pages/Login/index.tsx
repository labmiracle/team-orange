import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/authContext";

export function Login() {
    const { user, setUser } = useAuth();

    function login(event: React.FormEvent) {
        // const { user, password } = event.target as HTMLFormElement;
        // if (user && password) {
        //     fetch("http://localhost:4000/auth", {
        //         method: "GET",
        //         headers: {
        //             Authorization: btoa(`${user}:${password}`),
        //         },
        //     }).then(());
        // }
        setUser(true);
    }
    console.log(user);
    if (user) {
        return <Navigate to={"/"} />;
    }

    return (
        <main>
            <form onSubmit={login}>
                <div>
                    <label htmlFor="user">Usuario</label>
                    <input type="email" id="user" required />
                </div>
                <div>
                    <label htmlFor="password">Clave</label>
                    <input type="password" id="password" required />
                </div>
                <button type="submit">Acceder</button>
                <button>Registrarse</button>
            </form>
        </main>
    );
}
