import { Request, Response } from "express";
import * as ResponseHandler from "../helpers/response.handler";
import Messages from "../common/constants";
import * as appointmentLib from "../modules/appointments/appointment.lib";
import moment from "moment";
import * as errorlogs from "../modules/errorlogs/errorlogs.lib";
import mongoose from "mongoose";

class AppointmentController {
  static addAppointmentData = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const input = req.body;

      const obj = {
        customer_id: mongoose.Types.ObjectId.createFromHexString(
          input.customer_id
        ),
        staff_member_id: mongoose.Types.ObjectId.createFromHexString(
          input.staff_member_id
        ),
        appointment_date: input.appointment_date,
        duration: input.duration,
        reason: input.reason,
        status: "scheduled",
        created_user_id: loggedInUser,
      };
      const data = await appointmentLib.addAppointment(obj);
      res.locals.data = data;
      res.locals.message = Messages.SAVED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (error) {
      await logError(req, loggedInUser, error, "addAppointmentData");
      error.message = error.message.replace(
        "customer_appointment validation failed: appointment_date: ",
        ""
      );
      res.locals.message = error.message;
      ResponseHandler.JSONERROR(req, res);
    }
  };

  static updateAppointmentData = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const input = req.body;
      const appointment_id = req.params.id;

      const obj = {
        customer_id: mongoose.Types.ObjectId.createFromHexString(
          input.customer_id
        ),
        staff_member_id: mongoose.Types.ObjectId.createFromHexString(
          input.staff_member_id
        ),
        appointment_date: input.appointment_date,
        reason: input.reason,
        duration: input.duration,
        status: input.status,
        updated_user_id: loggedInUser,
      };

      await appointmentLib.updateAppointment(
        { appointment_id: appointment_id },
        obj
      );

      const data = await appointmentLib.getAppointmentById({
        appointment_id: appointment_id,
      });

      res.locals.data = data;
      res.locals.message = Messages.UPDATED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (error) {
      await logError(req, loggedInUser, error, "updateAppointmentData");
      console.log("a====>", error.message);
      let errorMessage = "Failed to update appointment";
      if (
        error.message.includes("Appointment conflict for the same date-time")
      ) {
        errorMessage = "Appointment conflict or within next 30 minutes";
      } else if (error.message.includes("Appointment not found for update")) {
        errorMessage = "Appointment not found for update";
      }

      res.locals.message = errorMessage;
      ResponseHandler.JSONERROR(req, res);
    }
  };

  static deleteAppointmentData = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const appointment_id = req.params.id;

      const result = await appointmentLib.deleteAppointment({
        appointment_id: appointment_id,
      });
      if (!result) throw new Error(Messages.SOMETHING_WENT_WRONG);
      res.locals.message = Messages.DELETED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (error) {
      await logError(req, loggedInUser, error, "deleteAppointmentData");
      res.locals.message = error.message;
      ResponseHandler.JSONERROR(req, res);
    }
  };

  static getAppointmentById = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const appointment_id = req.params.id;

      const data = await appointmentLib.getAppointmentById({
        appointment_id: appointment_id,
      });
      if (!data) res.locals.message = Messages.NO_DATA;

      res.locals.data = data;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (error) {
      await logError(req, loggedInUser, error, "getAppointmentById");
      res.locals.message = error.message;
      ResponseHandler.JSONERROR(req, res);
    }
  };

  static getAllAppointments = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const data = await appointmentLib.getAllAppointments({});
      if (!data) res.locals.message = Messages.NO_DATA;

      res.locals.data = data;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (error) {
      await logError(req, loggedInUser, error, "getAllAppointments");
      res.locals.message = error.message;
      ResponseHandler.JSONERROR(req, res);
    }
  };
}

async function logError(req, loggedInUser, error, functionName) {
  const datalog = {
    pagename: "AppointmentController",
    function_name: functionName,
    error_message: error.message,
    req_body: req.body && JSON.stringify(req.body),
    createddate: moment(new Date()).format(),
    created_user_id: loggedInUser,
  };
  await errorlogs.addErrorLogs(datalog);
}

export default AppointmentController;
