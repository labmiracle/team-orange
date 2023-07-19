import { NextFunction, Request, Response } from "express";
import Joi, { ValidationError } from "joi";

const productSchema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .pattern(/^[\p{L}\p{M}]+([ \p{L}\p{M}])*$/u)
        .messages({
            "string.min": "Invalid name, it must contain more than 3 letters",
            "string.max": "Invalid name, it must not contain more than 30 letters",
            "string.pattern.base": "Invalid name, it must contain only letters",
            "any.required": "Name is a required field",
        }),
    description: Joi.string().min(10).optional().required().messages({
        "string.min": "Invalid description, it must contain more than 10 letters",
        "any.required": "Description is a required field",
    }),
    price: Joi.number().positive().required().required().messages({
        "number.positive": "Invalid price, it must be positive number",
        "any.required": "Price is a required field",
    }),
    discountPercentage: Joi.number().min(0).max(1).required().messages({
        "number.min": "Invalid discount percentage, it must be greater than 0",
        "number.max": "Invalid discount percentage, it must not exceed 1",
        "any.required": "Discount porcentage is a required field",
    }),
    currentStock: Joi.number().min(0).required().messages({
        "number.min": "Invalid current stock, it must be greater than or equal to 0",
        "any.required": "Discount porcentage is a required field",
    }),
    reorderPoint: Joi.number().min(0).required().messages({
        "number.min": "Invalid reorder point, it must be greater than or equal to 0",
        "any.required": "Discount porcentage is a required field",
    }),
    minimum: Joi.number().min(0).required().messages({
        "number.min": "Invalid minimum, it must be greater than or equal to 0",
        "any.required": "Discount porcentage is a required field",
    }),
    categories: Joi.array()
        .items(
            Joi.string().valid(
                "Chaqueta",
                "Sudadera",
                "Zapatillas",
                "Vestido",
                "Pantalon",
                "Shorts",
                "Blusa",
                "Zapatos",
                "Gorra",
                "Traje",
                "Polo",
                "Jersey",
                "Camisa",
                "Sandalias",
                "Jeans",
                "Blazer",
                "Falda",
                "Camiseta",
                "Botas",
                "Traje de baño"
            )
        )
        .required()
        .messages({
            "any.required": "Discount porcentage is a required field",
        }),
    sizes: Joi.array()
        .items(Joi.string().valid("Hombre", "Mujer", "Niños"))
        .required()
        .messages({
            "any.required": "Discount porcentage is a required field",
        }),
    brandName: Joi.string().required().messages({
        "any.required": "Discount porcentage is a required field",
    }),
});

const paramsSchema = Joi.object({
    id: Joi.string()
        .pattern(/^[0-9]+$/, "numbers")
        .optional(),
    storeId: Joi.string().pattern(/^[0-9]+$/, "numbers"),
});

export const ProductUserValidations = (req: Request, res: Response, next: NextFunction) => {
    const { error } = productSchema.validate(req.body) && paramsSchema.validate(req.params);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
            data: undefined,
            error: true,
        });
    }
    return next();
};

const updateProductSchema = Joi.object({
    price: Joi.number().positive().optional().messages({
        "number.positive": "Invalid price, it must be positive number",
    }),
    discountPercentage: Joi.number().min(0).max(1).optional().messages({
        "number.min": "Invalid discount percentage, it must be greater than 0",
        "number.max": "Invalid discount percentage, it must not exceed 1",
    }),
    currentStock: Joi.number().min(0).optional().messages({
        "number.min": "Invalid current stock, it must be greater than or equal to 0",
    }),
    reorderPoint: Joi.number().min(0).optional().messages({
        "number.min": "Invalid reorder point, it must be greater than or equal to 0",
    }),
    minimum: Joi.number().min(0).optional().messages({
        "number.min": "Invalid minimum, it must be greater than or equal to 0",
    }),
});

export const ProductUpdateValidations = (req: Request, res: Response, next: NextFunction) => {
    const { error } = updateProductSchema.validate(req.body) && paramsSchema.validate(req.params);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
            data: undefined,
            error: true,
        });
    }
    return next();
};
