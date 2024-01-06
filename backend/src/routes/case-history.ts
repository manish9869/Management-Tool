import express from "express";
import CaseHistoryController from "../controllers/CaseHistoryController";
import { validateJwt } from "../middlewares/validateJWT";

const router = express.Router();

router.post("/upload", validateJwt, CaseHistoryController.uploadFile);

router.post("/", validateJwt, CaseHistoryController.addCaseHistoryData);

router.patch("/:id", validateJwt, CaseHistoryController.updateCaseHistoryData);

router.delete("/:id", validateJwt, CaseHistoryController.deleteCaseHistoryData);

router.get("/:id", validateJwt, CaseHistoryController.getCaseHistoryById);

router.get("/", validateJwt, CaseHistoryController.getAllCaseHistoryData);

export default router;
