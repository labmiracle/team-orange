import { Action, ApiController, Controller, HttpMethod } from "@miracledevs/paradigm-express-webapi";
import { UserI } from "../models/user";
import { JWTAuth } from "../filters/jwtAuth";
import { Path, POST } from "typescript-rest";
import { InvoiceRepository } from "../repositories/invoice.repository";
import { ItemRepository } from "../repositories/item.repository";
import { CartViewRepository } from "../repositories/cartView.repository";
import { InvoiceViewRepository } from "../repositories/invoiceView.repository";
import { CartRepository } from "../repositories/cart.repository";
import { Tags } from "typescript-rest-swagger";

@Path("/api/cart")
@Tags("Cart")
@Controller({ route: "/api/checkout" })
export class CheckoutController extends ApiController {
    constructor(
        private invoiceRepo: InvoiceRepository,
        private itemRepo: ItemRepository,
        private cartViewRepo: CartViewRepository,
        private invoiceViewRepo: InvoiceViewRepository,
        private cartRepo: CartRepository
    ) {
        super();
    }

    @POST
    @Path("/")
    @Action({ route: "/", method: HttpMethod.POST, filters: [JWTAuth], fromBody: true })
    async getInvoice({ decodedToken }: { decodedToken: UserI }) {
        try {
            return await this.invoiceViewRepo.find({ userId: decodedToken.id });
        } catch (err) {
            console.log(err);
            this.httpContext.response.sendStatus(500);
        }
    }

    @POST
    @Path("/")
    @Action({ route: "/", method: HttpMethod.POST, filters: [JWTAuth], fromBody: true })
    async produceInvoice({ decodedToken }: { decodedToken: UserI }) {
        try {
            const date = new Date();
            const cart = await this.cartViewRepo.find({ userId: decodedToken.id });
            const grandTotal = [...cart].reduce((acc, c) => acc + c.total, 0);
            const invoice = await this.invoiceRepo.insertOne({ userId: decodedToken.id, date: date, total: grandTotal });
            for (const item of cart) {
                const price = item.price * item.discountPercentage;
                await this.itemRepo.insertOne({
                    total: item.total,
                    quantity: item.quantity,
                    productId: item.productId,
                    unitPrice: price,
                    invoiceId: invoice.insertId,
                });
            }
            await this.cartRepo.delete({ userId: decodedToken.id });
            return await this.invoiceViewRepo.getById(invoice.insertId);
        } catch (err) {
            console.log(err);
            this.httpContext.response.sendStatus(500);
        }
    }
}
