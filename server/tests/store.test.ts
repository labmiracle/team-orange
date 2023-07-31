import { storeSchema } from "../src/models/schemas/store.schema";

const base_url = "http://localhost:4000/api/shop";

describe("/api/shop/names", () => {
    it("should return a product", async () => {
        const response = await fetch(base_url + "/names");
        expect(response.status).toBe(200);
        const names = await response.json();
        expect(names[0]).toHaveProperty("id");
        expect(names[0]).toHaveProperty("name");
    });
});

describe("/api/shop/:id", () => {
    it("should return a store", async () => {
        const response = await fetch(base_url + "/1");
        expect(response.status).toBe(200);
        const store = await response.json();
        const { error } = storeSchema.validate(store);
        expect(error).toBe(undefined);
    });
});
