import { CheckoutService } from "../services/Checkout.service";
import { UsersService } from "../services/User.service";
import { Params } from "react-router-dom";
export const UserLoader = {
    async getInvoices() {
        try {
            const checkout = new CheckoutService();
            const data = await checkout.getInvoices();
            return data;
        } catch (e) {
            console.error(e);
        }
    },
    async getUser({ params }: { params: Params }) {
        try {
            const user = new UsersService();
            const { email } = params;
            const data = await user.get(String(email));
            if (!data) throw new Error("User not found");
            return data;
        } catch (e) {
            console.error(e);
        }
    },
    async getAllUsers() {
        try {
            const user = new UsersService();
            const data = await user.getAll();
            if (!data) throw new Error("No Users found");
            return data;
        } catch (e) {
            console.error(e);
        }
    },
};
