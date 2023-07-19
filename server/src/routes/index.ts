import express from "express";
import userRoutes from "./users";
import productRoutes from "./products";

const router = express.Router();

router.use("/api/users", userRoutes);
router.use("/api/shop/:storeId/product", productRoutes);

export default router;
