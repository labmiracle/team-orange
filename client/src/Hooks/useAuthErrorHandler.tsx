import { useState } from "react";
import { InputError } from "../types/index";

export default function useAuthErrorHandler(): [InputError, typeof ErrorMessages, typeof handleError] {
    const [error, setError] = useState<InputError>(InputError.NONE);
    const [ErrorMessages, setErrorMessages] = useState({
        [InputError.USER_NOT_FOUND]: "Usuario no existe",
        [InputError.EMAIL]: "",
        [InputError.DUP_EMAIL]: "Email ya existe",
        [InputError.NAME]: "",
        [InputError.LAST_NAME]: "",
        [InputError.PASSWORD_MISMATCH]: "Las claves no coinciden",
        [InputError.PASSWORD]: "",
        [InputError.DUP_DNI]: "DNI ya existe",
        [InputError.DNI]: "",
        [InputError.ERROR]: "",
        [InputError.NONE]: "",
    });

    function errorMatcher(message: string) {
        if (message === "") return "NONE";
        if (/Unable to retrieve User/i.test(message)) return "USER_NOT_FOUND";
        if (/apellido/i.test(message)) return "LAST_NAME";
        if (/nombre/i.test(message)) return "NAME";
        if (/for key 'user.email'/i.test(message)) return "DUP_EMAIL";
        if (/email/i.test(message)) return "EMAIL";
        if (/password mismatch/i.test(message)) return "PASSWORD_MISMATCH";
        if (/password|contraseña/i.test(message)) return "PASSWORD";
        if (/for key 'user.idDocumentNumber'/i.test(message)) return "DUP_DNI";
        if (/documento/i.test(message)) return "DNI";
        return "ERROR";
    }

    function handleError(e: any) {
        const message = e?.response?.data.message || e.message;
        const errorType = errorMatcher(message);
        setError(InputError[errorType]);
        setErrorMessages(errors => ({
            ...errors,
            [InputError[errorType]]: message,
            [InputError.USER_NOT_FOUND]: "Usuario no existe",
            [InputError.DUP_EMAIL]: "Email ya existe",
            [InputError.PASSWORD_MISMATCH]: "Las claves no coinciden",
            [InputError.DUP_DNI]: "DNI ya existe",
        }));
    }

    return [error, ErrorMessages, handleError];
}
