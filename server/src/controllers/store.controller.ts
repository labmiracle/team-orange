import { Action, ApiController, Controller } from "@miracledevs/paradigm-express-webapi";
import { StoreRepository } from "../repositories/store.repository";
import { ProductRepository } from "../repositories/product.repository";
import { StoreColorRepository } from "../repositories/storeColor.repository";
import { StoreIS, Color } from "../models/store";
import { Path, PathParam, GET } from "typescript-rest";
import { Response, Tags } from "typescript-rest-swagger";

type Colors = {
    primary: Color;
    secondary: Color;
};

type Names = {
    /**@IsInt */
    id: number;
    name: string;
};

@Path("/api/shop")
@Tags("Stores")
@Controller({ route: "/api/shop" })
export class StoreController extends ApiController {
    constructor(private storeRepo: StoreRepository, private productRepo: ProductRepository, private storeColorRepo: StoreColorRepository) {
        super();
    }

    /**
     * Return an array of each store id and name
     * @returns [{id: number, name: string}]
     */
    @Path("/names")
    @GET
    @Response<Array<Names>>(200, "Return an array of each store id and name", [{ id: 1, name: "Tienda" }])
    @Response(500, "Stores not found", null)
    @Action({ route: "/names" })
    async getAll() {
        try {
            const store = await this.storeRepo.getBy("name");
            return this.httpContext.response.status(200).send(store);
        } catch (err) {
            console.error(err);
            return this.httpContext.response.status(500).send(err.message);
        }
    }

    /**
     * Return a store data with a give id
     * @param storeId
     * @returns {any}
     */
    @Path("/:storeId")
    @GET
    @Response<StoreIS>(200, "Return a store data", {
        id: 1,
        name: "Tienda 1",
        managerId: 1,
        apiUrl: "example.com",
        colors: {
            primary: { hue: 255, sat: 255, light: 0 },
            secondary: { hue: 0, sat: 0, light: 255 },
        },
        products: [
            {
                id: 1,
                name: "Camiseta",
                description: "Camiseta de manga corta",
                price: 100.0,
                discountPercentage: 0.6,
                currentStock: 250,
                reorderPoint: 10,
                minimum: 5,
                storeId: 1,
                categories: ["Camiseta"],
                sizes: ["Hombre", "Mujer"],
                brand: "Nike",
                url_img: "/images/cammisa01.webp",
                status: 1,
            },
        ],
    })
    @Response(500, "Store not found", null)
    @Action({ route: "/:storeId" })
    async getById(@PathParam("storeId") storeId: number) {
        try {
            const store = await this.storeRepo.getById(Number(storeId));
            const products = await this.productRepo.find(["storeId", "status"], [Number(storeId), 1]);
            const colorsResponse = await this.storeColorRepo.find(["storeId"], [Number(storeId)]);
            const colorsObj: Colors = {} as Colors;
            for (const color of colorsResponse) {
                const type = color.type.toLowerCase();
                colorsObj[type as keyof Colors] = { hue: color.hue, sat: color.sat, light: color.light };
            }
            return this.httpContext.response.status(200).send({ ...store, products: products, colors: colorsObj });
        } catch (err) {
            console.error(err);
            return this.httpContext.response.status(500).send(err.message);
        }
    }
}
