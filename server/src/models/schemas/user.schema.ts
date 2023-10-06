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
            "string.min": "Nombre inválido, debe contener mas de 3 letras",
            "string.max": "Nombre inválido, no debe contener mas de 30 letras",
            "string.pattern.base": "Nombre inválido, debe contener únicamente letras",
            "any.required": "Nombre es un campo requerido",
        }),
    lastName: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .optional()
        .pattern(/^[\p{L}\p{M}]+([ \p{L}\p{M}])*$/u)
        .messages({
            "string.min": "Apellido inválido, debe contener mas de 3 letras",
            "string.max": "Apellido inválido, no debe contener mas de 30 letras",
            "string.pattern.base": "Apellido inválido, debe contener únicamente letras",
            "any.required": "Apellido es un campo requerido",
        }),
    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*?[a-zA-Z])(?=.*?[0-9])(?!.*[^a-zA-Z0-9])/)
        .required()
        .messages({
            "string.min": "Contraseña inválida, debe contener mas de 8 dígitos",
            "string.pattern.base": "Contraseña inválida, debe contener letras y números",
            "any.required": "Contraseña es un campo requerido",
        }),
    idDocumentNumber: Joi.number().integer().min(10000000).max(99999999).optional().messages({
        "number.integer": "Numero de documento inválido, debe ser in numero",
        "number.min": "Numero de documento inválido, debe contener 8 dígitos",
        "number.max": "Numero de documento inválido, debe contener 8 dígitos",
    }),
    idDocumentType: Joi.string().default("DNI").optional().valid("DNI"),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required()
        .messages({
            "string.email": "Formato de email inválido",
            "any.required": "Email es un campo requerido",
        }),
    rol: Joi.any().forbidden().messages({
        "any.forbidden": "role is forbidden",
    }),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional(),
});

export const userLogin = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required().messages({
        "string.email": "Formato de email inválido",
        "any.required": "Email es un campo requerido",
    }),
    password: Joi.string().required().messages({
        "any.required": "Contraseña es un campo requerido",
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
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
});

export const userDBArray = Joi.array().items(userDBSchema);
