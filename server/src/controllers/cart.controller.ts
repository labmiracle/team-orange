import { Action, ApiController, Controller, HttpMethod } from "@miracledevs/paradigm-express-webapi";
import { CartRepository } from "../repositories/cart.repository";
import { UserI } from "../models/user";
import { JWTAuth } from "../filters/jwtAuth";
import { Path, GET, POST, DELETE, PUT } from "typescript-rest";
import { Response, Tags } from "typescript-rest-swagger";
import { ProductI } from "../models/product";
import { CartI } from "../models/cart";
import { CartViewRepository } from "../repositories/cartView.repository";

@Path("/api/cart")
@Tags("Cart")
@Controller({ route: "/api/cart" })
export class CartController extends ApiController {
    constructor(private cartRepo: CartRepository, private cartViewRepo: CartViewRepository) {
        super();
    }

    /**
     * GET a cart
     * @param id
     * @returns
     */
    @POST
    @Path("/")
    @Response<CartI[]>(200, "Retrieve a cart.")
    @Response(404, "Cart not found.")
    @Action({ route: "/", method: HttpMethod.POST, filters: [JWTAuth], fromBody: true })
    async get({ decodedToken }: { decodedToken: UserI }) {
        try {
            const cart = await this.cartViewRepo.find(["userId"], [decodedToken.id]);
            return cart;
        } catch (error) {
            return this.httpContext.response.status(500).json({
                message: error.message,
                data: null,
                error: true,
            });
        }
    }

    @POST
    @Path("/add")
    @Action({ route: "/add", method: HttpMethod.POST, fromBody: true, filters: [JWTAuth] })
    async add({ entity, decodedToken }: { entity: ProductI; decodedToken: UserI }) {
        try {
            await this.cartRepo.insertOne({ userId: decodedToken.id, productId: entity.id });
            return this.httpContext.response.status(201).json({
                message: "Product added to cart",
                data: undefined,
                error: false,
            });
        } catch (error) {
            return this.httpContext.response.status(500).json({
                message: error.message,
                data: null,
                error: true,
            });
        }
    }

    @DELETE
    @Path("/")
    @Action({ route: "/", method: HttpMethod.DELETE, fromBody: true, filters: [JWTAuth] })
    async delete({ entity, decodedToken }: { entity: ProductI; decodedToken: UserI }) {
        try {
            if (!entity.id) throw new Error("Missing ID product");
            await this.cartRepo.delete(["productId", "userId"], [entity.id, decodedToken.id]);
            return this.httpContext.response.status(201).json({
                message: "Product deleted from cart",
                data: undefined,
                error: false,
            });
        } catch (error) {
            if (error.message === "Missing ID product") {
                return this.httpContext.response.status(409).json({
                    message: error.message,
                    data: null,
                    error: true,
                });
            }
            if (error.message === "not found") {
                return this.httpContext.response.status(404).json({
                    message: "Product " + error.message,
                    data: null,
                    error: true,
                });
            }
            return this.httpContext.response.status(500).json({
                message: error.message,
                data: null,
                error: true,
            });
        }
    }

    @DELETE
    @Path("/deleteAll")
    @Action({ route: "/deleteAll", method: HttpMethod.DELETE, filters: [JWTAuth], fromBody: true })
    async deleteAll({ decodedToken }: { decodedToken: UserI }) {
        try {
            await this.cartRepo.delete(["userId"], [decodedToken.id]);
            return this.httpContext.response.status(201).json({
                message: "All products deleted from cart",
                data: undefined,
                error: false,
            });
        } catch (error) {
            return this.httpContext.response.status(500).json({
                message: error.message,
                data: null,
                error: true,
            });
        }
    }
}
