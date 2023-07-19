import express from "express";
import userController from "../controllers/userController";
import { userValidations } from "../validations/user";

const router = express.Router();

router
    .get("/:id", userController.getUser)
    .get("/", userController.getUsers)
    .post("/auth", userValidations, userController.createUser)
    .put("/:id", userController.updateUser)
    .delete("/:id", userController.deleteUser);

export default router;
