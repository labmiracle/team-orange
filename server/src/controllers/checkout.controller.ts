import { Action, ApiController, Controller, HttpMethod } from "@miracledevs/paradigm-express-webapi";
import { UserInterface } from "../models/user";
import { JWTAuthFilter } from "../filters/jwtAuth";
import { Path, POST, GET } from "typescript-rest";
import { InvoiceRepository } from "../repositories/invoice.repository";
import { ItemRepository } from "../repositories/item.repository";
import { InvoiceViewRepository } from "../repositories/invoiceView.repository";
import { Tags, Response } from "typescript-rest-swagger";
import { InvoiceViewInterface } from "../models/invoiceView";
import sendEmail from "../utils/sendEmail";
import { ProductSaleInterface } from "../models/product";
import dotenv from "dotenv";
dotenv.config();

@Path("/api/checkout")
@Tags("Cart")
@Controller({ route: "/api/checkout" })
export class CheckoutController extends ApiController {
    constructor(private invoiceRepo: InvoiceRepository, private itemRepo: ItemRepository, private invoiceViewRepo: InvoiceViewRepository) {
        super();
    }

    @GET
    @Path("/get")
    @Response<InvoiceViewInterface[]>(200, "Retrieve an invoice.")
    @Response(404, "Invoice not found.")
    @Response(500, "Server error.")
    @Action({ route: "/get", method: HttpMethod.GET, filters: [JWTAuthFilter], fromBody: true })
    async getInvoice() {
        try {
            const { id } = this.httpContext.request.body.decodedToken;
            const invoiceView = await this.invoiceViewRepo.find({ userId: id });
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

    //refactorizar produce
    @POST
    @Path("/produce")
    @Action({ route: "/produce", method: HttpMethod.POST, filters: [JWTAuthFilter], fromBody: true }) //add productsale array filter
    async produceInvoice({ entity, decodedToken }: { entity: ProductSaleInterface[]; decodedToken: UserInterface }) {
        try {
            const date = new Date();
            const grandTotal = [...entity].reduce((acc, c) => acc + c.price * c.discountPercentage * c.quantity, 0);
            const invoice = await this.invoiceRepo.insertOne({ userId: decodedToken.id, date: date, total: grandTotal });
            const items = entity.map(item => ({
                invoiceId: invoice.insertId,
                productId: item.id,
                unitPrice: item.price,
                quantity: item.quantity,
                total: item.price * item.discountPercentage * item.quantity,
            }));
            await this.itemRepo.insertItem(items);
            const invoiceView = await this.invoiceViewRepo.getById(invoice.insertId);
            const urlInfo = await sendEmail(invoiceView);

            return this.httpContext.response.status(200).json({
                message: "Invoice produced",
                data: { ...invoiceView, messageUrl: urlInfo },
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
