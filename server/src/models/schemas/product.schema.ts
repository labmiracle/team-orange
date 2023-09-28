import Joi from "joi";

export const productSchema = Joi.object({
    id: Joi.number().optional(),
    name: Joi.string().min(3).max(50).required().messages({
        //"string.min": "Invalid name, it must contain more than 3 letters",
        //"string.max": "Invalid name, it must not contain more than 30 letters",
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
        "any.required": "Discount percentage is a required field",
    }),
    currentStock: Joi.number().min(0).required().messages({
        "number.min": "Invalid current stock, it must be greater than or equal to 0",
        "any.required": "currentStock is a required field",
    }),
    reorderPoint: Joi.number().min(0).required().messages({
        "number.min": "Invalid reorder point, it must be greater than or equal to 0",
        "any.required": "reorderPoint is a required field",
    }),
    minimum: Joi.number().min(0).required().messages({
        "number.min": "Invalid minimum, it must be greater than or equal to 0",
        "any.required": "minimum is a required field",
    }),
    categories: Joi.array()
        .items(
            Joi.string()
            // .valid(
            //     "Chaqueta",
            //     "Sudadera",
            //     "Zapatillas",
            //     "Vestido",
            //     "Pantalon",
            //     "Shorts",
            //     "Blusa",
            //     "Zapatos",
            //     "Gorra",
            //     "Traje",
            //     "Polo",
            //     "Jersey",
            //     "Camisa",
            //     "Sandalias",
            //     "Jeans",
            //     "Blazer",
            //     "Falda",
            //     "Camiseta",
            //     "Botas",
            //     "Traje de baño"
            // )
        )
        .required()
        .messages({
            "any.required": "categories is a required field",
        }),
    sizes: Joi.array().items(Joi.string() /*.valid("Hombre", "Mujer", "Niños")*/).required().messages({
        "any.required": "sizes is a required field",
    }),
    brand: Joi.string().required().messages({
        "any.required": "brand is a required field",
    }),
    url_img: Joi.string().optional(),
    storeId: Joi.number().optional(),
    status: Joi.number().optional(),
});

const productSaleSchema = productSchema.keys({
    quantity: Joi.number().required(),
    total: Joi.number().optional(),
});

export const productSaleArray = Joi.array().items(productSaleSchema);

export const productArray = Joi.array().items(productSchema);
