import { Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../Context/AuthContext";
import { useLogin } from "../../services/useLogin";
import { Input } from "../../components/ui/Input";
import styles from "./index.module.css";
import { Button } from "../../components/ui/Button";
import useAuthErrorHandler from "../utilities/authErrorHandler";
import { InputError } from "../../types";

export function Register() {
    const { setUser } = useAuthContext();
    const { register, user } = useLogin();
    const [error, ErrorMessages, handleError] = useAuthErrorHandler();
    const navigate = useNavigate();

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        const { email, password, passwordConfirm, firstName, lastName, docType, docNumber } =
            event.target as HTMLFormElement;
        if (password.value !== passwordConfirm.value) {
            handleError(new Error("password mismatch"));
        } else {
            try {
                await register({
                    email: email.value,
                    password: password.value,
                    name: firstName.value,
                    lastName: lastName.value,
                    docType: docType.value,
                    docNumber: Number(docNumber.value),
                });
            } catch (e) {
                handleError(e);
            }
        }
        if (user) {
            setUser(user);
        }
    }

    return user ? (
        <Navigate to={"/"} />
    ) : (
        <>
            {/* <header className={styles.header}>
                <p className={styles.logo}>Shoppy</p>
            </header> */}
            <main className={styles.main}>
                <p className={styles.title}>Registrarse</p>
                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    {error === InputError.ERROR && <p>{ErrorMessages[error]}</p>}
                    <div className={styles.mainContent}>
                        <div className={styles.accountData}>
                            <Input
                                id="email"
                                type="email"
                                error={
                                    error === InputError.EMAIL || error === InputError.DUP_EMAIL
                                        ? ErrorMessages[error]
                                        : ""
                                }
                                required>
                                Correo electronico
                            </Input>

                            <Input
                                id="password"
                                type="password"
                                error={
                                    error === InputError.PASSWORD_MISMATCH || error === InputError.PASSWORD
                                        ? ErrorMessages[error]
                                        : ""
                                }
                                required>
                                Clave
                            </Input>
                            <Input
                                id="passwordConfirm"
                                error={error === InputError.PASSWORD_MISMATCH ? ErrorMessages[error] : ""}
                                type="password">
                                Confimar clave
                            </Input>
                        </div>
                        <hr />
                        <div className={styles.personalData}>
                            <Input
                                id="firstName"
                                type="text"
                                error={error === InputError.NAME ? ErrorMessages[error] : ""}
                                required>
                                Nombre
                            </Input>
                            <Input
                                id="lastName"
                                type="text"
                                error={error === InputError.LAST_NAME ? ErrorMessages[error] : ""}
                                required>
                                Apellido
                            </Input>
                            <div className={styles.documentContainer}>
                                <div className={styles.docTypeContainer}>
                                    <label htmlFor="">Tipo de documento</label>
                                    <select
                                        className={styles.docType}
                                        style={{ background: "#e3e3e3" }}
                                        name="docType"
                                        id="">
                                        <option value="DNI">DNI</option>
                                        <option value="LE">LE</option>
                                        <option value="LC">LC</option>
                                    </select>
                                </div>
                                <Input
                                    id="docNumber"
                                    error={
                                        error === InputError.DNI || error === InputError.DUP_DNI
                                            ? ErrorMessages[error]
                                            : ""
                                    }
                                    required>
                                    Numero de documento
                                </Input>
                            </div>
                        </div>
                    </div>
                    <div className={styles.buttonContainer}>
                        <Button type="submit" style={{ color: "white " }}>
                            Crear cuenta
                        </Button>
                        <Button variant="ghost" type="button" onClick={() => navigate("/login")}>
                            Iniciar sesion
                        </Button>
                    </div>
                </form>
            </main>
        </>
    );
}
