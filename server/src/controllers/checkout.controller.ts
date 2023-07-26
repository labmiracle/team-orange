import { Action, ApiController, Controller, HttpMethod } from "@miracledevs/paradigm-express-webapi";
import { UserI } from "../models/user";
import { JWTAuth } from "../filters/jwtAuth";
import { Path, POST } from "typescript-rest";
import { InvoiceRepository } from "../repositories/invoice.repository";
import { ItemRepository } from "../repositories/item.repository";
import { CartViewRepository } from "../repositories/cartView.repository";
import { InvoiceViewRepository } from "../repositories/invoiceView.repository";
import { CartRepository } from "../repositories/cart.repository";
import { Tags, Response } from "typescript-rest-swagger";
import { InvoiceViewI } from "../models/invoiceView";

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
    @Path("/get")
    @Response<InvoiceViewI[]>(200, "Retrieve an invoice.")
    @Response(404, "Invoice not found.")
    @Response(500, "Server error.")
    @Action({ route: "/get", method: HttpMethod.POST, filters: [JWTAuth], fromBody: true })
    async getInvoice({ decodedToken }: { decodedToken: UserI }) {
        try {
            const invoiceView = await this.invoiceViewRepo.find({ userId: decodedToken.id });
            if (invoiceView.length === 0) throw new Error("No Invoice found");
            return this.httpContext.response.status(200).json({
                message: "Invoice found",
                data: invoiceView,
                error: false,
            });
        } catch (error) {
            console.error(error);
            const response = this.httpContext.response;
            if (error.message === "No Invoice found") response.status(404);
            else response.status(500);
            return response.json({
                message: error.message,
                data: null,
                error: true,
            });
        }
    }

    @POST
    @Path("/produce")
    @Action({ route: "/produce", method: HttpMethod.POST, filters: [JWTAuth], fromBody: true })
    async produceInvoice({ decodedToken }: { decodedToken: UserI }) {
        try {
            const date = new Date();
            const cart = await this.cartViewRepo.find({ userId: decodedToken.id });
            if (cart.length === 0) throw new Error("No items in cart");
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
            const invoiceView = await this.invoiceViewRepo.getById(invoice.insertId);
            return this.httpContext.response.status(200).json({
                message: "Invoice produced",
                data: invoiceView,
                error: false,
            });
        } catch (error) {
            console.error(error);
            const response = this.httpContext.response;
            if (error.message === "No items in cart") response.status(404);
            else response.status(500);
            return response.json({
                message: error.message,
                data: null,
                error: true,
            });
        }
    }
}
