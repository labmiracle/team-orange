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
import { InvoiceRepository } from "../repositories/invoice.repository";
import { ItemRepository } from "../repositories/item.repository";
import { CartViewRepository } from "../repositories/cartView.repository";

@Path("/api/cart")
@Tags("Cart")
@Controller({ route: "/api/checkout" })
export class CheckoutController extends ApiController {
    constructor(
        private cartRepo: CartRepository,
        private userRepo: UserRepository,
        private productRepo: ProductRepository,
        private invoiceRepo: InvoiceRepository,
        private itemRepo: ItemRepository,
        private cartViewRepo: CartViewRepository
    ) {
        super();
    }

    @Action({ route: "/", method: HttpMethod.GET, filters: [JWTAuth], fromBody: true })
    async getInvoice({ decodedToken }: { decodedToken: UserI }) {
        try {
            return await this.invoiceRepo.find(["userId"], [decodedToken.id]);
        } catch (err) {
            console.log(err);
            this.httpContext.response.sendStatus(500);
        }
    }

    @Action({ route: "/", method: HttpMethod.POST, filters: [JWTAuth], fromBody: true })
    async produceInvoice({ decodedToken }: { decodedToken: UserI }) {
        try {
            const date = new Date();
            const cart = await this.cartViewRepo.find(["userId"], [decodedToken.id]);
            const arrItems = [];
            for (const item of cart) {
                const quantity = cart.filter(i => i.id === item.id).length;
                const total = quantity * item.price;
                arrItems.push({ quantity: quantity, total: total, unitPrice: item.price, productId: item.productId });
            }
            const grandTotal = [...arrItems].reduce((acc, c) => acc + c.total, 0);
            const invoice = await this.invoiceRepo.insertOne({ userId: decodedToken.id, date: date, total: grandTotal });
            for (const item of arrItems) {
                await this.itemRepo.insertOne({ ...item, invoiceId: invoice.insertId });
            }
        } catch (err) {
            console.log(err);
            this.httpContext.response.sendStatus(500);
        }
    }
}
