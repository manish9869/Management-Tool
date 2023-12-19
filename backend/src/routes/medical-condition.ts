import express from "express";
import MedicalConditionController from "../controllers/medicalConditionController";
import { validateJwt } from "../middlewares/validateJWT";

const router = express.Router();

router.get(
  "/:id",
  validateJwt,
  MedicalConditionController.getMedicalConditionById
);
router.get(
  "/",
  validateJwt,
  MedicalConditionController.getAllMedicalConditions
);
router.post("/", validateJwt, MedicalConditionController.addMedicalCondition);
router.patch(
  "/:id",
  validateJwt,
  MedicalConditionController.updateMedicalCondition
);
router.delete(
  "/:id",
  validateJwt,
  MedicalConditionController.deleteMedicalCondition
);

export default router;
