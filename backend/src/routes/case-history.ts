import express from "express";
import CaseHistoryController from "../controllers/CaseHistoryController";

const router = express.Router();

router.post("/", CaseHistoryController.addCaseHistoryData);
router.put("/:id", CaseHistoryController.updateCaseHistoryData);
router.delete("/:id", CaseHistoryController.deleteCaseHistoryData);
router.get("/:id", CaseHistoryController.getCaseHistoryById);
router.get("/", CaseHistoryController.getAllCaseHistoryData);

export default router;
