import express from "express";
import TreatmentController from "../controllers/treatmentController";
import { validateJwt } from "../middlewares/validateJWT";

const router = express.Router();

router.get("/:id", validateJwt, TreatmentController.getTreatmentById);

router.get("/", validateJwt, TreatmentController.getAllTreatments);

router.post("/", validateJwt, TreatmentController.addTreatment);

router.patch("/:id", validateJwt, TreatmentController.updateTreatment);

router.delete("/:id", validateJwt, TreatmentController.deleteTreatment);

export default router;
