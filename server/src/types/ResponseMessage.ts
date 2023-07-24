import { StoreI } from "../models/store";
import { ProductDBI, ProductI } from "../models/product";
import { UserI } from "../models/user";

export interface ResponseMessage {
    message: string;
    data: ProductI | ProductI[] | ProductDBI | UserI | UserI[] | StoreI | null;
    error: boolean;
}
