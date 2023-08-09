import Joi from "joi";

export const userSchema = Joi.object({
    id: Joi.number().optional(),
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .optional()
        .pattern(/^[\p{L}\p{M}]+([ \p{L}\p{M}])*$/u)
        .messages({
            "string.min": "Invalid name, it must contain more than 3 letters",
            "string.max": "Invalid name, it must not contain more than 30 letters",
            "string.pattern.base": "Invalid name, it must contain only letters",
            "any.required": "Name is a required field",
        }),
    lastName: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .optional()
        .pattern(/^[\p{L}\p{M}]+([ \p{L}\p{M}])*$/u)
        .messages({
            "string.min": "Invalid last name, it must contain more than 3 letters",
            "string.max": "Invalid last name, it must not contain more than 30 letters",
            "string.pattern.base": "Invalid last name, it must contain only letters",
            "any.required": "Last name is a required field",
        }),
    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*?[a-zA-Z])(?=.*?[0-9])(?!.*[^a-zA-Z0-9])/)
        .required()
        .messages({
            "string.min": "Invalid password, it must contain more than 8 letters",
            "string.pattern.base": "Invalid password, it must contain both letters and numbers",
            "any.required": "Password is a required field",
        }),
    idDocumentNumber: Joi.number().integer().min(10000000).max(99999999).optional().messages({
        "number.integer": "Invalid document number, it must be an integer",
        "number.min": "Invalid document number, it must be contain 8 digits",
        "number.max": "Invalid document number, it must be contain 8 digits",
    }),
    idDocumentType: Joi.string().default("DNI").optional().valid("DNI"),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required()
        .messages({
            "string.email": "Invalid email format",
            "any.required": "Email is a required field",
        }),
    rol: Joi.any().forbidden().messages({
        "any.forbidden": "role is forbidden",
    }),
});

export const userLogin = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required().messages({
        "string.email": "Invalid email format",
        "any.required": "Email is a required field",
    }),
    password: Joi.string().min(8).required().messages({
        "string.min": "Invalid password, it must contain more than 8 letters",
        "any.required": "Password is a required field",
    }),
});

export const userDBSchema = Joi.object({
    id: Joi.number(),
    email: Joi.string().email({ minDomainSegments: 2 }),
    name: Joi.string(),
    lastName: Joi.string(),
    idDocumentType: Joi.string().default("DNI").valid("DNI"),
    idDocumentNumber: Joi.number().integer(),
    rol: Joi.string().optional(),
    status: Joi.number().optional(),
});

export const userDBArray = Joi.array().items(userDBSchema);
