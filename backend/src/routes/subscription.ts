import express from "express";
import SubscriptionController from "../controllers/subscriptionController";
import { validateJwt } from "../middlewares/validateJWT";

const router = express.Router();

router.get("/:id", SubscriptionController.getSubscriptionDataById);

router.get("/", SubscriptionController.getAllSubscriptionData);

router.post("/", SubscriptionController.addSubscriptionData);

router.patch("/:id", SubscriptionController.updateSubscriptionData);

router.delete("/:id", SubscriptionController.deleteSubscriptionData);

export default router;
