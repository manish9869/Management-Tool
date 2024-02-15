import express from "express";
import CaseHistoryController from "../controllers/CaseHistoryController";
import { validateJwt } from "../middlewares/validateJWT";

const router = express.Router();

router.post("/upload", validateJwt, CaseHistoryController.uploadFile);

router.post("/", validateJwt, CaseHistoryController.addCaseHistoryData);

router.patch(
  "/update-media/:id",
  validateJwt,
  CaseHistoryController.updateCaseHistoryMediaData
);

router.patch("/:id", validateJwt, CaseHistoryController.updateCaseHistoryData);

router.delete(
  "/delete-image/:imageName",
  validateJwt,
  CaseHistoryController.deleteFile
);

router.delete("/:id", validateJwt, CaseHistoryController.deleteCaseHistoryData);

router.get(
  "/customer/:id",
  validateJwt,
  CaseHistoryController.getCaseHistoryByCustomerId
);

router.get("/:id", validateJwt, CaseHistoryController.getCaseHistoryById);

router.get("/", validateJwt, CaseHistoryController.getAllCaseHistoryData);

export default router;
