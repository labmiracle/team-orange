import express from "express";
import productController from "../controllers/productController";

const router = express.Router();

router
    .get("/:id", productController.getProduct)
    .get("/", productController.getProducts)
    .post("/", productController.createProduct)
    .delete("/:id", productController.deleteProduct)
    .patch("/:id", productController.updateProduct);

export default router;
