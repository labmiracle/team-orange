import express from "express";
import productController from "../controllers/productController";
import { ProductUserValidations } from "../validations/product";

const router = express.Router({ mergeParams: true });

router
    .get("/:id", productController.getProduct)
    .get("/", productController.getProducts)
    .post("/", ProductUserValidations, productController.createProduct)
    .delete("/:id", productController.deleteProduct)
    .patch("/:id", productController.updateProduct);

export default router;
