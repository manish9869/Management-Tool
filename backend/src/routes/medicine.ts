// Medicine Routes (routes/medicineRoutes.js)
import express from "express";
import MedicineController from "../controllers/medicineController";

const router = express.Router();

router.get("/:id", MedicineController.getMedicineDataById);
router.get("/", MedicineController.getAllMedicineData);
router.post("/", MedicineController.addMedicineData);
router.patch("/:id", MedicineController.updateMedicineData);
router.delete("/:id", MedicineController.deleteMedicineData);

export default router;
