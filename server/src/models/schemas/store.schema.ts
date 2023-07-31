import Joi from "joi";
import { productArray } from "./product.schema";

export const storeSchema = Joi.object({
    id: Joi.number().optional(),
    name: Joi.string().required(),
    managerId: Joi.number(),
    apiUrl: Joi.string(),
    status: Joi.number().optional(),
    colors: Joi.object({
        primary: Joi.object({
            hue: Joi.number(),
            sat: Joi.number(),
            light: Joi.number(),
        }),
        secondary: Joi.object({
            hue: Joi.number(),
            sat: Joi.number(),
            light: Joi.number(),
        }),
    }),
    products: productArray,
});
