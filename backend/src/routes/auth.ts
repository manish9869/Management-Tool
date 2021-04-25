import express from "express";
import AuthController from "../controllers/authController";
import { validateJwt } from "../middlewares/validateJWT";

const router = express.Router();

router.post("/login", AuthController.login);

router.post("/verify", validateJwt, AuthController.verifyOTP);

export default router;
