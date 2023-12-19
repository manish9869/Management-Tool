import express from "express";
import AppointmentController from "../controllers/appointmentController";
import { validateJwt } from "../middlewares/validateJWT";

const router = express.Router();

router.get("/:id", AppointmentController.getAppointmentById);

router.get("/", AppointmentController.getAllAppointments);

router.post("/", AppointmentController.addAppointmentData);

router.patch("/:id", AppointmentController.updateAppointmentData);

router.delete("/:id", AppointmentController.deleteAppointmentData);

export default router;
