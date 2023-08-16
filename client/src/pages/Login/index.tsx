import { Navigate, useNavigate } from "react-router-dom";
import { useLogin } from "../../services/useLogin";
import { Input } from "../../components/ui/Input";
import styles from "./index.module.css";
import { Button } from "../../components/ui/Button";
import useAuthErrorHandler from "../utilities/authErrorHandler";
import { InputError } from "../../types";

export function Login() {
    const { getAuth, user } = useLogin();
    const [error, ErrorMessages, handleError] = useAuthErrorHandler();
    const navigate = useNavigate();
    async function login(event: React.FormEvent) {
        event.preventDefault();
        const { email, password } = event.target as HTMLFormElement;
        try {
            await getAuth(email.value, password.value);
        } catch (e) {
            handleError(e);
        }
    }
    console.log(ErrorMessages);
    return user ? (
        <Navigate to={"/"} />
    ) : (
        <>
            <main className={styles.main}>
                <p className={styles.title}>Iniciar sesion</p>
                <form onSubmit={login} className={styles.loginForm}>
                    <Input
                        id="email"
                        type="text"
                        error={
                            error === InputError.EMAIL ||
                            error === InputError.DUP_EMAIL ||
                            error === InputError.USER_NOT_FOUND
                                ? ErrorMessages[error]
                                : ""
                        }
                        required>
                        Correo electronico
                    </Input>
                    <Input
                        id="password"
                        type="password"
                        error={error === InputError.PASSWORD ? ErrorMessages[error] : ""}
                        required>
                        Clave
                    </Input>
                    <div className={styles.buttonContainer}>
                        <Button type="submit" style={{ color: "white" }}>
                            Acceder
                        </Button>
                        <Button
                            variant="ghost"
                            type="button"
                            style={{ color: "black" }}
                            onClick={() => navigate("/register")}>
                            Registrarse
                        </Button>
                    </div>
                </form>
            </main>
        </>
    );
}
