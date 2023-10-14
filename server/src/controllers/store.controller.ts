import { Action, ApiController, Controller, HttpMethod } from "@miracledevs/paradigm-express-webapi";
import { StoreRepository } from "../repositories/store.repository";
import { ProductRepository } from "../repositories/product.repository";
import { StoreColorRepository } from "../repositories/storeColor.repository";
import { StoreInterface, ColorInterface, StoreColorInterface } from "../models/store";
import { Path, PathParam, GET, DELETE, POST, PUT } from "typescript-rest";
import { Response, Tags } from "typescript-rest-swagger";
import { JWTAuthFilter, isAdminFilter, isManagerFilter } from "../filters/jwtAuth";
import { StoreFilter } from "../filters/store.filter";
import { UserRepository } from "../repositories/user.repository";

type Colors = {
    primary: ColorInterface;
    secondary: ColorInterface;
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
    constructor(
        private readonly storeRepo: StoreRepository,
        private readonly productRepo: ProductRepository,
        private readonly storeColorRepo: StoreColorRepository,
        private readonly userRepo: UserRepository
    ) {
        super();
    }

    /**
     * Return an array of each store id and name
     * @returns [{id: number, name: string}]
     */
    @Path("/names")
    @GET
    @Response<Array<Names>>(200, "Return an array of each store id and name")
    @Response(500, "Stores not found", null)
    @Action({ route: "/names", method: HttpMethod.GET })
    async getNames() {
        const stores = await this.storeRepo.getNames();
        return stores;
    }

    @Path("/")
    @GET
    @Response<Array<StoreInterface>>(200, "Return an array of each store id and name")
    @Response(500, "Stores not found", null)
    @Action({ route: "/", method: HttpMethod.GET })
    async getAll() {
        const stores = await this.storeRepo.getStores();
        return stores;
    }

    /**
     * Return a store data with a give id
     * @param storeId
     * @returns {any}
     */
    @Path("/:storeId")
    @GET
    @Response<StoreInterface>(200, "Return a store data")
    @Response(500, "Store not found", null)
    @Action({ route: "/:storeId", method: HttpMethod.GET })
    async getById(@PathParam("storeId") storeId: number) {
        const store = await this.storeRepo.getById(Number(storeId));
        const colorsResponse = await this.storeColorRepo.find({ storeId: Number(storeId) });
        const colorsObj: Colors = {} as Colors;
        for (const color of colorsResponse) {
            const type = color.type.toLowerCase();
            colorsObj[type as keyof Colors] = { hue: color.hue, sat: color.sat, light: color.light };
        }
        const filters = await this.storeRepo.getCategoriesAndSizesById(storeId);
        const categoryArr = (filters.categories as { category: string }[]).map(item => item.category);
        const sizeArr = (filters.sizes as { size: string }[]).map(item => item.size);
        return { ...store, colors: colorsObj, categories: categoryArr, sizes: sizeArr };
    }

    @Path("/:storeId")
    @DELETE
    @Response<void>(200, "Disable a store setting it's status to 0")
    @Response(500, "Store not found", null)
    @Action({ route: "/:storeId", method: HttpMethod.DELETE, filters: [JWTAuthFilter, isAdminFilter] })
    async disableStore(@PathParam("storeId") storeId: number) {
        await this.storeRepo.update({ id: storeId, status: 0 });
    }

    @Path("delete/:storeId")
    @DELETE
    @Response<void>(200, "Delete a store")
    @Response(500, "Store not found", null)
    @Action({ route: "delete/:storeId", method: HttpMethod.DELETE, filters: [JWTAuthFilter, isAdminFilter] })
    async deleteStore(@PathParam("storeId") storeId: number) {
        await this.storeRepo.delete({ id: storeId });
    }

    @Path("/")
    @POST
    @Response<StoreInterface>(200, "Create a store")
    @Response(500, "Server error", null)
    @Action({ route: "/", method: HttpMethod.POST, fromBody: true, filters: [StoreFilter, JWTAuthFilter, isAdminFilter] })
    async createStore(store: StoreInterface) {
        let colors = store.colors;
        delete store.colors;
        const [user] = await this.userRepo.find({ id: store.managerId });
        if (user.rol !== "Manager") throw new Error("User is not a manager");
        const result = await this.storeRepo.insertOne(store);

        if (!colors) {
            colors = {
                primary: { hue: 12, sat: 12, light: 12 } as ColorInterface,
                secondary: { hue: 240, sat: 240, light: 240 } as ColorInterface,
            };
        }

        const primary: StoreColorInterface = { ...colors.primary, storeId: result.insertId, type: "PRIMARY" };
        const secondary: StoreColorInterface = { ...colors.secondary, storeId: result.insertId, type: "SECONDARY" };
        await this.storeColorRepo.insertOne(primary);
        await this.storeColorRepo.insertOne(secondary);
        const newStore = await this.storeRepo.getById(result.insertId);
        return newStore;
    }
    /**
     * UPDATE a store
     * @param store
     * @returns
     */
    @Path("/update")
    @PUT
    @Response<void>(200, "Update a Store")
    @Response(500, "Store not found.")
    @Action({
        route: "/update",
        filters: [StoreFilter, JWTAuthFilter, isManagerFilter],
        fromBody: true,
        method: HttpMethod.PUT,
    })
    async update(store: StoreInterface) {
        const { id: idManager } = this.userRepo.getAuth();
        const { id: idStore } = (await this.storeRepo.find({ managerId: idManager }))[0];
        const colors = store.colors;
        delete store.colors;
        delete store.products;
        await this.storeRepo.update({ ...store, id: idStore });
        if (colors.primary) {
            const { id: idPrimary } = (await this.storeColorRepo.find({ storeId: idStore, type: "PRIMARY" }))[0];
            await this.storeColorRepo.update({ ...colors.primary, id: idPrimary });
        }
        if (colors.secondary) {
            const { id: idSecondary } = (await this.storeColorRepo.find({ storeId: idStore, type: "SECONDARY" }))[0];
            await this.storeColorRepo.update({ ...colors.secondary, id: idSecondary });
        }
    }

    @Path("/restore/:storeId")
    @PUT
    @Response<void>(200, "Restore a store setting it's status to 1")
    @Response(500, "Store not found", null)
    @Action({ route: "/:storeId", method: HttpMethod.PUT, filters: [JWTAuthFilter, isAdminFilter] })
    async restoreStore(@PathParam("storeId") storeId: number) {
        await this.storeRepo.update({ id: storeId, status: 1 });
    }

    /**
     * GET all products from a manager id
     * @returns products array
     */
    @GET
    @Path("/manager/:managerId")
    @Response<StoreInterface[]>(200, "Retrieve Store")
    @Response(500, "Store not found")
    @Response(500, "Products not found")
    @Action({ route: "/manager/:managerId", method: HttpMethod.GET, filters: [JWTAuthFilter, isManagerFilter] })
    async getByManager(@PathParam("managerId") managerId: number) {
        const { id } = (await this.storeRepo.find({ managerId: Number(managerId) }))[0];
        const store = await this.getById(id);
        if (!store) throw new Error("Store not found");
        const products = await this.productRepo.find({ storeId: id, status: 1 });
        if (!products) throw new Error("Products not found");
        store.products = products;
        return store;
    }
}
