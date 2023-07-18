import { Request, Response } from "express";
import { getProductService, deleteProductService, getProductsService, createProductService, updateProductService } from "../services/productService";
import { Product, ResponseProduct } from "../models/productModel";

const getProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            return res.status(400).json({
                message: "ID must be a numeric value.",
                data: undefined,
                error: true,
            });
        }
        const product = await getProductService(id);
        return res.status(200).json({
            message: "Product found",
            data: product,
            error: false,
        });
    } catch (error: any) {
        if (error.message === "Product not found") {
            return res.status(404).json({
                message: error.message,
                data: undefined,
                error: true,
            });
        }
        return res.status(500).json({
            message: error.message,
            data: undefined,
            error: true,
        });
    }
};

const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await getProductsService();
        if (products.length > 0) {
            return res.status(200).json({
                message: "Products found",
                data: products,
                error: false,
            });
        }
        return res.status(200).json({
            message: "No products found",
            data: products,
            error: false,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
            data: undefined,
            error: true,
        });
    }
};

const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price, discountPercentage, currentStock, reorderPoint, minimum, brandId, url_img, sizes, categories, storeId, brandName } = req.body;
        const product: ResponseProduct = {
            name,
            description,
            price,
            discountPercentage,
            currentStock,
            reorderPoint,
            minimum,
            brandId,
            url_img,
            storeId,
            categories,
            sizes,
            brandName,
        };
        const createdProduct = await createProductService(product);
        return res.status(201).json({
            message: "Product created",
            data: createdProduct,
            error: false,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
            data: undefined,
            error: true,
        });
    }
};

const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const productData: Product = req.body;
        if (isNaN(Number(id)) || !productData) {
            return res.status(400).json({
                message: "Invalid request",
                data: undefined,
                error: true,
            });
        }
        const productUpdated = await updateProductService(id, productData);
        if (!productUpdated) {
            return res.status(200).json({
                message: "No change was made",
                data: undefined,
                error: false,
            });
        }
        return res.status(200).json({
            message: "Product updated",
            data: productUpdated,
            error: false,
        });
    } catch (error: any) {
        if (error.message === "Product not found") {
            return res.status(404).json({
                message: error.message,
                data: undefined,
                error: true,
            });
        }
        return res.status(500).json({
            message: "Internal server error",
            data: undefined,
            error: true,
        });
    }
};

const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            return res.status(400).json({
                message: "ID must be a numeric value.",
                data: undefined,
                error: true,
            });
        }
        const productDeleted = await deleteProductService(Number(id));
        if (productDeleted) {
            return res.status(200).json({
                message: "Product deleted successfully",
                data: undefined,
                error: false,
            });
        } else {
            return res.status(404).json({
                message: "Product not found",
                data: undefined,
                error: true,
            });
        }
    } catch (error: any) {
        return res.status(500).json({
            message: "Internal server error",
            data: undefined,
            error: true,
        });
    }
};

export default {
    getProduct,
    getProducts,
    deleteProduct,
    createProduct,
    updateProduct,
};
