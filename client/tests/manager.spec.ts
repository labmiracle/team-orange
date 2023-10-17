import { test, expect, Page } from "@playwright/test";

test.describe("Manager test", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:5173/");
    });

    test("Login", async ({ page }) => {
        await logIn(page);
        await expect(page.getByText("Hi, Joe Schmo")).toBeVisible();
    });

    test("Update store's color", async ({ page }) => {
        await logIn(page);
        await page.getByRole("link", { name: "Manager" }).click();
        await page.getByRole("contentinfo").click();
        await page.getByLabel("Primary:").click();
        await page.getByLabel("Primary:").fill("#1e2133");
        await page.getByRole("button", { name: "update!" }).click();
        await page.goto("http://localhost:5173/");
        await page.getByRole("link", { name: "Manager" }).click();
        await page.getByRole("contentinfo").click();
        const footerElement = await page.getByRole("contentinfo");
        if (footerElement) {
            const backgroundColor = await footerElement.evaluate(element => {
                const style = window.getComputedStyle(element);
                return style.backgroundColor;
            });
            expect(backgroundColor).toBe("rgb(30, 33, 51)");
        } else {
            console.error("Elemento del footer no encontrado.");
        }
    });

    test("Create, update and delete store's product", async ({ page }) => {
        await logIn(page);
        await page.getByRole("link", { name: "Manager" }).click();
        await page.getByRole("link", { name: "🚀 Create Product" }).click();
        await page.getByLabel("name*").fill("Test");
        await page.getByLabel("description*").fill("Esto es un test");
        await page.getByLabel("price*").fill("123");
        await page.getByLabel("brand*").fill("Nike");
        await page.getByLabel("reorderPoint").fill("12");
        await page.getByLabel("minimum").fill("14");
        await page.getByLabel("categories*").fill("a");
        await page.getByText("Chaqueta").click();
        await page.getByLabel("sizes*").click();
        await page.getByLabel("sizes*").fill("e");
        await page.getByText("Hombre").click();
        await page.getByLabel("currentStock").fill("100");
        await page.getByLabel("image").click();
        await page.getByLabel("image").setInputFiles("./public/test.webp");
        await page.getByRole("button", { name: "create!" }).click();
        await page.getByRole("link", { name: "Armario" }).click();
        await page.getByRole("link", { name: "Manager" }).click();
        const row = await page.getByRole("row").last();
        const cellID = await row.getByRole("cell").first().textContent();
        await page.goto(`http://localhost:5173/products/${cellID}`);
        await expect(page.getByText("Test", { exact: true })).toBeVisible();
        await expect(page.getByText("$ 123,00")).toBeVisible();
        await expect(page.getByText("Esto es un test")).toBeVisible();
        await page.getByRole("link", { name: "Manager" }).click();
        await page.getByRole("cell", { name: "Esto es un test" }).click();
        await page.getByRole("cell", { name: "images/test.webp" }).click({
            button: "right",
        });
        await page
            .getByText("Primary: Secondary: update!🚀 Create ProductIDNombreDescripcionPrecioDescuentoMa")
            .click();
        await page
            .getByRole("row", { name: "Test Esto es un test 123 1 Nike 14 12 Chaqueta Hombre images/test.webp ❌ ⚡" })
            .getByTitle("update")
            .click();
        await page.getByLabel("name:").fill("Test updateado");
        await page.getByLabel("description:").fill("Esto es un test updateado");
        await page
            .locator("form")
            .filter({ hasText: "name:description:Esto es un test updateadoprice:discount:brand:reorderPoint:mini" })
            .getByRole("button")
            .click();
        await page
            .locator("div")
            .filter({ hasText: /^Update Product$/ })
            .getByRole("button")
            .click();
        await expect(page.getByRole("cell", { name: "Test updateado", exact: true })).toBeVisible();
        await expect(page.getByRole("cell", { name: "Esto es un test updateado" })).toBeVisible();
        await page
            .getByRole("row", {
                name: `${cellID} Test updateado Esto es un test updateado 123 1 Nike 14 12 Chaqueta Hombre images/test.webp ❌ ⚡`,
            })
            .getByTitle("delete")
            .click();
        await page.getByRole("link", { name: "Armario" }).click();
        await page.getByRole("link", { name: "Manager" }).click();
        await expect(page.getByRole("cell", { name: "Test updateado", exact: true })).not.toBeVisible();
    });

    async function logIn(page: Page) {
        await page.getByRole("link", { name: "Ingresar" }).click();
        await page.getByLabel("Correo electronico").fill("manager@example.com");
        await page.getByLabel("Clave").fill("test1234");
        await page.getByRole("button", { name: "Acceder" }).click();
    }
});
