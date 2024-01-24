import express from "express";
import InvoiceController from "../controllers/invoiceController";
import { validateJwt } from "../middlewares/validateJWT";

const router = express.Router();

router.get("/:id", validateJwt, InvoiceController.getInvoiceDataById);

router.get("/", validateJwt, InvoiceController.getAllInvoiceData);

router.post("/", validateJwt, InvoiceController.addInvoiceData);

router.patch("/:id", validateJwt, InvoiceController.updateInvoiceData);

router.delete("/:id", validateJwt, InvoiceController.deleteInvoiceData);

export default router;
