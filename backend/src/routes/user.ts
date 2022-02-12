import express from "express";
import UserController from "../controllers/userController";
import { validateJwt } from "../middlewares/validateJWT";
import { addUserValidation } from "../validation/user.validation";

const router = express.Router();

router.get("/:id", validateJwt, UserController.getUserDataById);

router.get("/", validateJwt, UserController.getAllUserData);

router.post("/", addUserValidation, UserController.addUserData);

router.patch("/:id", validateJwt, UserController.updateUserData);

router.delete("/:id", validateJwt, UserController.deleteUserData);

export default router;
