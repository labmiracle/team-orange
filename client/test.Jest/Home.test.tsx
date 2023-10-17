/* eslint-disable no-unused-labels */
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "@/pages/Home/index";
import userEvent from "@testing-library/user-event";
import Login from "@/pages/Login/index";
import { useLogin } from "../src/Hooks/useLogin";

jest.mock("react-router-dom", () => ({
    Navigate: jest.fn(),
    useNavigate: jest.fn(),
}));

jest.mock("jose", () => ({
    decodeJwt: jest.fn(),
}));

jest.mock("../src/Hooks/useLogin", () => ({
    useLogin: jest.fn(() => {
        return {
            ...jest.requireActual("../src/Hooks/useLogin"),
            getAuth: jest.fn((email: string, password: string) => {
                return {
                    email,
                    password,
                };
            }),
        };
    }),
}));

describe("Home Component", () => {
    test("Render home", () => {
        render(<Home />);
        expect(screen.getByText("¡Bienvenido a Shoppy, la magia de las galerías en línea!")).toBeDefined();
        expect(screen.getByAltText("Mujer feliz comprando en nuestro sitio web")).toBeDefined();
    });
});

describe("Login Component", () => {
    beforeEach(() => {
        render(<Login />);
    });

    test("Render Login", async () => {
        const robot = userEvent.setup();

        await robot.type(screen.getByLabelText(/Correo electronico/i), "nicofonta2@gmail.com");
        await robot.type(screen.getByLabelText(/Clave/i), "test1234");

        expect(screen.getByLabelText(/Correo electronico/i)).toHaveValue("nicofonta2@gmail.com");
        expect(screen.getByLabelText(/Clave/i)).toHaveValue("test1234");

        expect(screen.getByRole("button", { name: "Acceder" })).toBeDefined();
        expect(screen.getByRole("button", { name: "Registrarse" })).toBeDefined();
    });

    test("login function", async () => {
        const robot = userEvent.setup();
        const { getAuth } = useLogin();
        await robot.click(screen.getByRole("button", { name: "Acceder" }));
        expect(useLogin).toHaveBeenCalled();

        await robot.type(screen.getByLabelText(/Correo electronico/i), "nicofonta2@gmail.com");
        await robot.type(screen.getByLabelText(/Clave/i), "test1234");
        const emailInput = screen.getByLabelText("Correo electronico") as HTMLInputElement;
        const passwordInput = screen.getByLabelText("Clave") as HTMLInputElement;
        const emailValue = emailInput.value;
        const passwordValue = passwordInput.value;

        expect(getAuth(emailValue, passwordValue)).toStrictEqual({
            email: "nicofonta2@gmail.com",
            password: "test1234",
        });
        expect(getAuth).toHaveBeenCalled();
    });
});
