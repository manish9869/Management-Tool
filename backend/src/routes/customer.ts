import express from "express";
import CustomerController from "../controllers/customerController";
import { validateJwt } from "../middlewares/validateJWT";

const router = express.Router();

router.get("/:id", CustomerController.getCustomerDataById);

router.get("/", CustomerController.getAllCustomerData);

router.post("/", validateJwt, CustomerController.addCustomerData);

router.patch("/:id", CustomerController.updateCustomerData);

router.delete("/:id", validateJwt, CustomerController.deleteCustomerData);

export default router;
