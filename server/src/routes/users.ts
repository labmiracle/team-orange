import express from "express";
import userController from "../controllers/users";
const router = express.Router();

router
  .get("/:id?", userController.getUsers)
  .post("/", userController.createUser)
  .put("/:id", userController.updateUser)
  .delete("/:id", userController.deleteUser);

export default router;
