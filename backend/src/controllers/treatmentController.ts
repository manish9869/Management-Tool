import { Request, Response } from "express";
import * as ResponseHandler from "../helpers/response.handler";
import Messages from "../common/constants";
import * as treatmentLib from "../modules/treatment/treatment.lib"; // Adjust the path based on your folder structure
import moment from "moment";
import * as errorlogs from "../modules/errorlogs/errorlogs.lib";
import mongoose from "mongoose";

class TreatmentController {
  static addTreatment = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const input = req.body;

      const obj = {
        name: input.name,
        description: input.description,
        cost: input.cost,
        duration: input.duration,
        type: input.type,
        created_user_id: loggedInUser,
      };

      const data = await treatmentLib.addTreatment(obj);
      res.locals.data = data;
      res.locals.message = Messages.SAVED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "TreatmentController",
        function_name: "addTreatment",
        error_message: e,
        req_body: req.body,
        createddate: moment(new Date()).format(),
        created_user_id: loggedInUser,
      };
      await errorlogs.addErrorLogs(datalog);
      res.locals.errors = e.message;
      ResponseHandler.JSONERROR(req, res);
    }
  };

  static updateTreatment = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const input = req.body;
      const treatmentId = req.params.id;

      const obj = {
        name: input.name,
        description: input.description,
        cost: input.cost,
        duration: input.duration,
        type: input.type,
        updated_user_id: loggedInUser,
      };

      await treatmentLib.updateTreatment(treatmentId, obj);

      const data = await treatmentLib.getTreatmentById(treatmentId);

      res.locals.data = data;
      res.locals.message = Messages.UPDATED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "TreatmentController",
        function_name: "updateTreatment",
        error_message: e,
        req_body: req.body && JSON.stringify(req.body),
        createddate: moment(new Date()).format(),
        created_user_id: loggedInUser,
      };
      await errorlogs.addErrorLogs(datalog);
      res.locals.errors = e.message;
      ResponseHandler.JSONERROR(req, res);
    }
  };

  static deleteTreatment = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const treatmentId = req.params.id;

      const result = await treatmentLib.deleteTreatment(treatmentId);
      if (!result) throw new Error(Messages.SOMETHING_WENT_WRONG);

      res.locals.message = Messages.DELETED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "TreatmentController",
        function_name: "deleteTreatment",
        error_message: e,
        req_body: req.body && JSON.stringify(req.body),
        createddate: moment(new Date()).format(),
        created_user_id: loggedInUser,
      };
      await errorlogs.addErrorLogs(datalog);
      res.locals.errors = e.message;
      ResponseHandler.JSONERROR(req, res);
    }
  };

  static getTreatmentById = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const treatmentId = req.params.id;

      const data = await treatmentLib.getTreatmentById(treatmentId);
      if (!data) res.locals.message = Messages.NO_DATA;

      res.locals.data = data;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "TreatmentController",
        function_name: "getTreatmentById",
        error_message: e,
        req_body: req.body && JSON.stringify(req.body),
        createddate: moment(new Date()).format(),
        created_user_id: loggedInUser,
      };
      await errorlogs.addErrorLogs(datalog);
      res.locals.errors = e.message;
      ResponseHandler.JSONERROR(req, res);
    }
  };

  static getAllTreatments = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const data = await treatmentLib.getAllTreatments();
      if (!data) res.locals.message = Messages.NO_DATA;

      res.locals.data = data;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "TreatmentController",
        function_name: "getAllTreatments",
        error_message: e,
        req_body: req.body && JSON.stringify(req.body),
        createddate: moment(new Date()).format(),
        created_user_id: loggedInUser,
      };
      await errorlogs.addErrorLogs(datalog);
      res.locals.errors = e.message;
      ResponseHandler.JSONERROR(req, res);
    }
  };
}
export default TreatmentController;
