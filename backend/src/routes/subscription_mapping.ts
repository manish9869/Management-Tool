import express from "express";
import Subscription_mappingController from "../controllers/subscription_mappingController";
import { validateJwt } from "../middlewares/validateJWT";

const router = express.Router();

router.get("/:id", Subscription_mappingController.getSubscription_mappingDataById);

router.get("/", Subscription_mappingController.getAllSubscription_mappingData);

router.post("/", Subscription_mappingController.addSubscription_mappingData);

router.patch("/:id", Subscription_mappingController.updateSubscription_mappingData);

router.delete("/:id", Subscription_mappingController.deleteSubscription_mappingData);

export default router;
