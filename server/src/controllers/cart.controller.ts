import { Action, ApiController, Controller, HttpMethod } from "@miracledevs/paradigm-express-webapi";
import { CartRepository } from "../repositories/cart.repository";
import { UserI } from "../models/user";
import { JWTAuth } from "../filters/jwtAuth";
import { Path, POST, DELETE, GET } from "typescript-rest";
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
     * decodedToken: UserI - It's the token each user get when they login or signup
     * @param id
     * @returns
     */
    @GET
    @Path("/")
    @Response<CartI[]>(200, "Retrieve a cart.")
    @Response(404, "Cart not found.")
    @Response(500, "Server error.")
    @Action({ route: "/", method: HttpMethod.GET, filters: [JWTAuth], fromBody: true })
    async get() {
        try {
            const { id } = this.httpContext.request.body.decodedToken;
            const cart = await this.cartViewRepo.find({ userId: id });
            if (!cart) throw new Error("Cart not found");
            return this.httpContext.response.status(200).json({
                message: "Cart found",
                data: cart,
                error: false,
            });
        } catch (error) {
            if (error.message === "Cart not found") {
                return this.httpContext.response.status(404).json({
                    message: error.message,
                    data: undefined,
                    error: true
                });
            }
            return this.httpContext.response.status(500).json({
                message: error.message,
                data: undefined,
                error: true,
            });
        }
    }

    /**
     * ADD a cart
     * entity: ProductI - The product to add
     * decodedToken: UserI - It's the token each user get when they login or signup
     * @param param0
     * @returns
     */
    @POST
    @Path("/add")
    @Response(201, "Add product to cart.")
    @Response(500, "Server error.")
    @Action({ route: "/add", method: HttpMethod.POST, fromBody: true, filters: [JWTAuth] })
    async add({ entity, decodedToken }: { entity: ProductI; decodedToken: UserI }) {
        try {
            await this.cartRepo.insertItem({ userId: decodedToken.id, productId: entity.id });
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
    /**
     * DELETE a cart
     * entity: ProductI - The product to delete
     * decodedToken: UserI - It's the token each user get when they login or signup
     * @param param0
     * @returns
     */
    @DELETE
    @Path("/")
    @Response(201, "Delete a product from cart.")
    @Response(409, "Product ID .")
    @Response(404, "Product not found.")
    @Response(500, "Server error.")
    @Action({ route: "/", method: HttpMethod.DELETE, fromBody: true, filters: [JWTAuth] })
    async delete({ entity, decodedToken }: { entity: ProductI; decodedToken: UserI }) {
        try {
            if (!entity.id) throw new Error("Missing ID product");
            await this.cartRepo.delete({ productId: entity.id, userId: decodedToken.id });
            return this.httpContext.response.status(201).json({
                message: "Product deleted from cart",
                data: undefined,
                error: false,
            });
        } catch (error) {
            const response = this.httpContext.response;
            if (error.message === "Missing ID product") response.status(409);
            if (error.message === "not found") response.status(404);
            else response.status(500);
            return response.json({
                message: error.message,
                data: null,
                error: true,
            });
        }
    }
    /**
     * DELETE all cart
     * decodedToken: UserI - It's the token each user get whent hey login or signup
     * @param param0
     * @returns
     */
    @DELETE
    @Path("/deleteAll")
    @Response(201, "Delete all products from cart.")
    @Response(500, "Server Error.")
    @Action({ route: "/deleteAll", method: HttpMethod.DELETE, filters: [JWTAuth], fromBody: true })
    async deleteAll({ decodedToken }: { decodedToken: UserI }) {
        try {
            await this.cartRepo.delete({ userId: decodedToken.id });
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
