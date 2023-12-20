// Medicine Routes (routes/medicineRoutes.js)
import express from "express";
import MedicineController from "../controllers/medicineController";
import { validateJwt } from "../middlewares/validateJWT";

const router = express.Router();

router.get("/:id", validateJwt, MedicineController.getMedicineDataById);

router.get("/", validateJwt, MedicineController.getAllMedicineData);

router.post("/", validateJwt, MedicineController.addMedicineData);

router.patch("/:id", validateJwt, MedicineController.updateMedicineData);

router.delete("/:id", validateJwt, MedicineController.deleteMedicineData);

export default router;
