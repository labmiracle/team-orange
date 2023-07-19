import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const userSchema = Joi.object({
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
    lastName: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
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
    repeat_password: Joi.ref("password"),
    idDocumentNumber: Joi.number().integer().min(10000000).max(99999999).messages({
        "number.integer": "Invalid document number, it must be an integer",
        "number.min": "Invalid document number, it must be contain 8 digits",
        "number.max": "Invalid document number, it must be contain 8 digits",
    }),
    idDocumentType: Joi.string().default("DNI").valid("DNI"),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required()
        .messages({
            "string.email": "Invalid email format",
            "any.required": "Email is a required field",
        }),
    rol: Joi.string().valid("client", "manager", "admin").messages({
        "any.required": "Rol is a required field",
        "any.only": "Invalid rol, it must be 'client', 'manager' or 'admin'",
    }),
});

export const userValidations = (req: Request, res: Response, next: NextFunction) => {
    const userValidation = userSchema.validate(req.body);
    if (userValidation.error) {
        return res.status(400).json({
            message: userValidation.error.details[0].message,
            data: undefined,
            error: true,
        });
    }
    return next();
};

const userLogin = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required()
        .messages({
            "string.email": "Invalid email format",
            "any.required": "Email is a required field",
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
});

export const userLoginValidations = (req: Request, res: Response, next: NextFunction) => {
    const userValidation = userLogin.validate(req.body);
    if (userValidation.error) {
        return res.status(400).json({
            message: userValidation.error.details[0].message,
            data: undefined,
            error: true,
        });
    }
    return next();
};
