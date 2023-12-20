import express from "express";
import AppointmentController from "../controllers/appointmentController";
import { validateJwt } from "../middlewares/validateJWT";

const router = express.Router();

router.get("/:id", validateJwt, AppointmentController.getAppointmentById);

router.get("/", validateJwt, AppointmentController.getAllAppointments);

router.post("/", validateJwt, AppointmentController.addAppointmentData);

router.patch("/:id", validateJwt, AppointmentController.updateAppointmentData);

router.delete("/:id", validateJwt, AppointmentController.deleteAppointmentData);

export default router;
