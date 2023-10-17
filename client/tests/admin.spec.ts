import { test, expect, Page } from "@playwright/test";

test.describe("Admin test", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:5173/");
    });

    test("Login", async ({ page }) => {
        await logIn(page);
    });

    test("Create, disable, restore and delete store", async ({ page }) => {
        await createUserTest(page);
        await logIn(page);
        await page.getByRole("link", { name: "Admin" }).click();
        const table = await page.getByRole("table").first();
        const row = await table.getByRole("row").last();
        const cellID = await row.getByRole("cell").first().textContent();

        await page
            .getByRole("row", { name: `${cellID} test test test@test.com Client DNI 12334566 1` })
            .getByTitle("change role manager")
            .click();
        await page.getByRole("button", { name: "Set Manager" }).click();
        await expect(
            page.getByRole("row", { name: `${cellID} test test test@test.com Manager DNI 12334566 1` })
        ).toBeVisible();
        await page.getByRole("button", { name: "Crear tienda" }).click();
        await page.locator('input[name="name"]').fill("Test");
        await page.locator('input[name="managerId"]').fill(`${cellID}`);
        await page.locator('input[name="apiUrl"]').fill("test.com");
        await page.getByRole("button", { name: "Create" }).click();
        await page
            .getByRole("row", { name: `Test ${cellID} 1 ⛔ ✅ ❌` })
            .getByTitle("disable")
            .click();
        await expect(page.getByRole("row", { name: `Test ${cellID} 0 ⛔ ✅ ❌` })).toBeVisible();
        await page
            .getByRole("row", { name: `Test ${cellID} 0 ⛔ ✅ ❌` })
            .getByTitle("restore")
            .click();
        await expect(page.getByRole("row", { name: `Test ${cellID} 1 ⛔ ✅ ❌` })).toBeVisible();
        await page
            .getByRole("row", { name: `Test ${cellID} 1 ⛔ ✅ ❌` })
            .getByTitle("delete")
            .click();
        await expect(page.getByRole("row", { name: `Test ${cellID} 1 ⛔ ✅ ❌` })).not.toBeVisible();
        await page
            .getByRole("row", { name: `${cellID} test test test@test.com Manager DNI 12334566 1` })
            .getByTitle("delete")
            .click();
        await expect(
            page.getByRole("row", { name: `${cellID} test test test@test.com Manager DNI 12334566 1` })
        ).not.toBeVisible();
    });

    test("Create, disable, restore, change role and delete user", async ({ page }) => {
        await createUserTest(page);
        await logIn(page);
        await page.getByRole("link", { name: "Admin" }).click();
        const table = await page.getByRole("table").first();
        const row = await table.getByRole("row").last();
        const cellID = await row.getByRole("cell").first().textContent();
        await page
            .getByRole("row", { name: `${cellID} test test test@test.com Client DNI 12334566 1` })
            .getByTitle("disable")
            .click();
        await expect(
            page.getByRole("row", { name: `${cellID} test test test@test.com Client DNI 12334566 0` })
        ).toBeVisible();
        await page
            .getByRole("row", { name: `${cellID} test test test@test.com Client DNI 12334566 0` })
            .getByTitle("restore")
            .click();
        await expect(
            page.getByRole("row", { name: `${cellID} test test test@test.com Client DNI 12334566 1` })
        ).toBeVisible();
        await page
            .getByRole("row", { name: `${cellID} test test test@test.com Client DNI 12334566 1` })
            .getByTitle("change role manager")
            .click();
        await page.getByRole("button", { name: "Set Manager" }).click();
        await expect(
            page.getByRole("row", { name: `${cellID} test test test@test.com Manager DNI 12334566 1` })
        ).toBeVisible();
        await page
            .getByRole("row", { name: `${cellID} test test test@test.com Manager DNI 12334566 1` })
            .getByTitle("change role user")
            .click();
        await expect(
            page.getByRole("row", { name: `${cellID} test test test@test.com Client DNI 12334566 1` })
        ).toBeVisible();
        await page
            .getByRole("row", { name: `${cellID} test test test@test.com Client DNI 12334566 1` })
            .getByTitle("delete")
            .click();
        await expect(
            page.getByRole("row", { name: `${cellID} test test test@test.com Client DNI 12334566 1` })
        ).not.toBeVisible();
    });

    async function logIn(page: Page) {
        await page.getByRole("link", { name: "Ingresar" }).click();
        await page.getByLabel("Correo electronico").fill("admin@example.com");
        await page.getByLabel("Clave").fill("test1234");
        await page.getByRole("button", { name: "Acceder" }).click();
        await expect(page.getByText("Hi, John Doe")).toBeVisible();
    }

    async function createUserTest(page: Page) {
        await page.getByRole("link", { name: "Registrarse" }).click();
        await page.getByLabel("Correo electronico").fill("test@test.com");
        await page.getByLabel("Clave", { exact: true }).fill("test1234");
        await page.getByLabel("Confimar clave").fill("test1234");
        await page.getByLabel("Nombre").fill("test");
        await page.getByLabel("Apellido").fill("test");
        await page.getByLabel("Numero de documento").fill("12334566");
        await page.getByRole("button", { name: "Crear cuenta" }).click();
        await page.getByRole("button", { name: "logout" }).click();
    }
});
