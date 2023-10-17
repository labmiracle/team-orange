import { test, expect, Page } from "@playwright/test";

test.describe("Client test", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:5173/");
    });

    test("Register", async ({ page }) => {
        await page.getByRole("link", { name: "Registrarse" }).click();
        await page.getByLabel("Correo electronico").click();
        await page.getByLabel("Correo electronico").fill("usertest@gmail.com");
        await page.getByLabel("Clave", { exact: true }).fill("test1234");
        await page.getByLabel("Confimar clave").fill("test1234");
        await page.getByLabel("Nombre").fill("User");
        await page.getByLabel("Apellido").fill("Test");
        await page.getByLabel("Numero de documento").fill("12344567");
        await page.getByRole("button", { name: "Crear cuenta" }).click();
        await expect(page.getByText("Hi, User Test")).toBeVisible();
        await page.getByRole("button", { name: "logout" }).click();
        await expect(page.getByText("Hi, User Test")).not.toBeVisible();
    });

    test("Register errors", async ({ page }) => {
        await page.getByRole("link", { name: "Registrarse" }).click();
        await page.getByLabel("Correo electronico").click();
        await page.getByLabel("Correo electronico").fill("usertest@gmail.com");
        await page.getByLabel("Clave", { exact: true }).fill("test");
        await page.getByLabel("Clave", { exact: true }).press("Tab");
        await page.getByLabel("Confimar clave").fill("test");
        await page.getByLabel("Nombre").fill("User");
        await page.getByLabel("Apellido").fill("Test");
        await page.getByLabel("Numero de documento").fill("12344567");
        await page.getByRole("button", { name: "Crear cuenta" }).click();
        await expect(page.getByText("Contraseña inválida, debe contener mas de 8 dígitos")).toBeVisible();
        await page.getByLabel("Clave", { exact: true }).fill("test1234");
        await page.getByRole("button", { name: "Crear cuenta" }).click();
        expect(page.getByText("Contraseña inválida, debe contener mas de 8 dígitos")).not.toBeVisible();
        await expect(
            page
                .locator("div")
                .filter({ hasText: /^ClaveLas claves no coinciden$/ })
                .locator("small")
        ).toBeVisible();
        await expect(
            page
                .locator("div")
                .filter({ hasText: /^Confimar claveLas claves no coinciden$/ })
                .locator("small")
        ).toBeVisible();
        await page.getByLabel("Confimar clave").fill("test1234");
        await page.getByRole("button", { name: "Crear cuenta" }).click();
        await expect(
            page
                .locator("div")
                .filter({ hasText: /^ClaveLas claves no coinciden$/ })
                .locator("small")
        ).not.toBeVisible();
        await expect(
            page
                .locator("div")
                .filter({ hasText: /^Confimar claveLas claves no coinciden$/ })
                .locator("small")
        ).not.toBeVisible();
        await expect(page.getByText("Email ya existe")).toBeVisible();
        await page.getByLabel("Correo electronico").fill("usertest2@gmail.com");
        await page.getByRole("button", { name: "Crear cuenta" }).click();
        await expect(page.getByText("DNI ya existe")).toBeVisible();
    });

    test("Login", async ({ page }) => {
        await logIn(page);
        await expect(page.getByText("Hi, User Test")).toBeVisible();
        await page.getByRole("button", { name: "logout" }).click();
    });

    test("Login errors", async ({ page }) => {
        await page.goto("http://localhost:5173/");
        await page.getByRole("link", { name: "Ingresar" }).click();
        await page.getByLabel("Correo electronico").fill("usertest@gmail.com");
        await page.getByLabel("Clave").fill("test");
        await page.getByRole("button", { name: "Acceder" }).click();
        await expect(page.getByText("Incorrect username or password")).toBeVisible();
        await page.getByLabel("Clave").fill("test1234");
        await page.getByLabel("Correo electronico").fill("usertes@gmail.con");
        await page.getByRole("button", { name: "Acceder" }).click();
        await expect(page.getByText("Incorrect username or password")).not.toBeVisible();
        await expect(page.getByText("Formato de email inválido")).toBeVisible();
        await page.getByLabel("Correo electronico").fill("usertes@gmail.com");
        await page.getByRole("button", { name: "Acceder" }).click();
        await expect(page.getByText("Formato de email inválido")).not.toBeVisible();
        await expect(page.getByText("Incorrect username or password")).toBeVisible();
        await page.getByLabel("Correo electronico").fill("usertest@gmail.com");
        await page.getByRole("button", { name: "Acceder" }).click();
        await expect(page.getByText("Usuario no existe")).not.toBeVisible();
        await page.getByText("Hi, User Test").click();
    });

    test("Buy", async ({ page }) => {
        await logIn(page);

        await page.getByRole("link", { name: "Armario" }).click();
        await page.getByRole("link", { name: "Vestido floral CASIO VESTIDO FLORAL $69.99 Ver" }).click();
        await page.getByRole("button", { name: "Agregar al carrito" }).click();
        await page.getByRole("link", { name: "Atico Vintage" }).click();
        await page.getByRole("link", { name: "Sudadera con capucha TOPPER SUDADERA CON CAPUCHA $59.99 Ver" }).click();
        await page
            .locator("div")
            .filter({ hasText: /^Cantidad$/ })
            .click();
        await page.getByLabel("Cantidad").fill("2");
        await page.getByRole("button", { name: "Agregar al carrito" }).click();
        await page.getByLabel("Ir al carrito de compras").click();
        await page.getByRole("button", { name: "-" }).first().click();
        await page.getByRole("button", { name: "+" }).nth(1).click();
        await page.getByRole("button", { name: "-" }).nth(1).click();
        await page.getByRole("button", { name: "-" }).nth(1).click();
        await page
            .locator("li")
            .filter({ hasText: "Sudadera con capucha$ 59,99-1+" })
            .getByRole("button")
            .nth(2)
            .click();
        await page.getByRole("button", { name: "Continuar" }).click();
        await page
            .locator("div")
            .filter({ hasText: /^Nombre y apellido$/ })
            .getByRole("textbox")
            .click();
        await page
            .locator("div")
            .filter({ hasText: /^Nombre y apellido$/ })
            .getByRole("textbox")
            .fill("Nicolas Fontana");
        await page
            .locator("div")
            .filter({ hasText: /^Nombre y apellido$/ })
            .getByRole("textbox")
            .press("Tab");
        await page
            .locator("div")
            .filter({ hasText: /^Documento$/ })
            .getByRole("spinbutton")
            .fill("12344568");
        await page
            .locator("div")
            .filter({ hasText: /^Documento$/ })
            .getByRole("spinbutton")
            .press("Tab");
        await page
            .locator("div")
            .filter({ hasText: /^Numero de la tarjeta$/ })
            .getByRole("spinbutton")
            .fill("12341233412312");
        await page.locator('input[type="month"]').click();
        await page.locator('input[type="month"]').press("Tab");
        await page
            .locator("div")
            .filter({ hasText: /^Numero de la tarjeta$/ })
            .getByRole("spinbutton")
            .click();
        await page
            .locator("div")
            .filter({ hasText: /^Numero de la tarjeta$/ })
            .getByRole("spinbutton")
            .press("Tab");
        await page.locator('input[type="month"]').press("Tab");
        await page.locator('input[type="month"]').fill("1234-02");
        await page.locator('input[type="month"]').press("Tab");
        await page.locator("div").filter({ hasText: /^CVV$/ }).getByRole("spinbutton").fill("123");
        await page.getByRole("button", { name: "Confirmar pago" }).click();
        await page.getByRole("heading", { name: "INVOICE" }).click();
        await page.getByRole("heading", { name: "Grand Total: $69.99" }).click();
        await page.getByRole("cell", { name: "Vestido floral" }).click();
    });

    test("Check invoice", async ({ page }) => {
        await logIn(page);
        await page.getByRole("link", { name: "Mi perfil" }).click();
        await page.getByRole("link", { name: "Historial Compras" }).click();
        await page.getByRole("heading", { name: "Grand Total: $69.99" }).last().click();
    });

    test("Delete account", async ({ page }) => {
        await logIn(page);

        await page.getByRole("link", { name: "Mi perfil" }).click();
        await page.getByRole("button", { name: "Deshabilitar Cuenta" }).click();
        await page.getByLabel("Ingresar Contraseña").fill("test1234");
        await page.getByRole("button", { name: "Deshabilitar", exact: true }).click();
        await page.getByRole("link", { name: "Registrarse" }).isVisible();
        await page.getByRole("link", { name: "Ingresar" }).isVisible();
    });

    async function logIn(page: Page) {
        await page.getByRole("link", { name: "Ingresar" }).click();
        await page.getByLabel("Correo electronico").fill("usertest@gmail.com");
        await page.getByLabel("Clave").fill("test1234");
        await page.getByRole("button", { name: "Acceder" }).click();
    }
});
