/* eslint-disable @typescript-eslint/no-explicit-any */
import { productSchema, productArray } from "../src/models/schemas/product.schema";

const base_url = "http://localhost:4000/api/product";

describe("/api/product/:id", () => {
    it("should return a product", async () => {
        const response = await fetch(base_url + "/1");
        expect(response.status).toBe(200);
        const product = await response.json();
        const { error } = productSchema.validate(product.data);
        expect(error).toBe(undefined);
    });
    it("should return 404", async () => {
        const response = await fetch(base_url + "/test");
        expect(response.status).toBe(404);
        const responseObj = await response.json();
        expect(responseObj.error).toBe(true);
    });
});

describe("/api/product", () => {
    it("should return an array of products", async () => {
        const response = await fetch(base_url + "/");
        expect(response.status).toBe(200);
        const products = await response.json();
        const { error } = productArray.validate(products.data);
        expect(error).toBe(undefined);
    });
});
