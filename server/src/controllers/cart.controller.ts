import { Action, ApiController, Controller, HttpMethod } from "@miracledevs/paradigm-express-webapi";
import { CartRepository } from "../repositories/cart.repository";
import { UserRepository } from "../repositories/user.repository";
import { UserI } from "../models/user";
import { JWTAuth } from "../filters/jwtAuth";
import { Path, GET, POST, DELETE, PUT } from "typescript-rest";
import { Response, Tags } from "typescript-rest-swagger";
import { ProductI } from "../models/product";
import { ProductRepository } from "../repositories/product.repository";
import { CartI } from "../models/cart";

@Path("/api/cart")
@Tags("Cart")
@Controller({ route: "/api/cart" })
export class CartController extends ApiController {
    constructor(private cartRepo: CartRepository, private userRepo: UserRepository, private productRepo: ProductRepository) {
        super();
    }

    /**
     * GET a cart
     * @param id
     * @returns
     */
    @GET
    @Path("/")
    @Response<CartI[]>(200, "Retrieve a cart.")
    @Response(404, "Cart not found.")
    @Action({ route: "/", method: HttpMethod.GET, filters: [JWTAuth], fromBody: true })
    async get({ decodedToken }: { decodedToken: UserI }) {
        try {
            const cart = await this.cartRepo.find(["userId"], [decodedToken.id]);
            const cartItems = cart.map(async item => {
                const product = await this.productRepo.getById(item.productId);
                return { ...item, product: product };
            });
            return Promise.all(cartItems);
        } catch (error) {
            console.log(error.message);
        }
    }

    @POST
    @Path("/")
    @Action({ route: "/", method: HttpMethod.POST, fromBody: true, filters: [JWTAuth] })
    async add({ entity, decodedToken }: { entity: ProductI; decodedToken: UserI }) {
        try {
            await this.cartRepo.insertOne({ userId: decodedToken.id, productId: entity.id });
        } catch (error) {
            console.log(error.message);
        }
    }

    @DELETE
    @Path("/")
    @Action({ route: "/", method: HttpMethod.DELETE, fromBody: true, filters: [JWTAuth] })
    async delete({ entity, decodedToken }: { entity: ProductI; decodedToken: UserI }) {
        try {
            await this.cartRepo.delete(["productId", "userId"], [entity.id, decodedToken.id]);
        } catch (error) {
            console.log(error.message);
        }
    }
}
