import { Request, Response } from "express";
import * as ResponseHandler from "../helpers/response.handler";
import Messages from "../common/constants";
import * as medicalConditionLib from "../modules/medical-condition/medical-condition.lib";
import moment from "moment";
import * as errorlogs from "../modules/errorlogs/errorlogs.lib";

class MedicalConditionController {
  static addMedicalCondition = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const input = req.body;

      const obj = {
        name: input.name,
        description: input.description,
        symptoms: input.symptoms,
        type: input.type,
        // Add other fields based on your schema
      };

      const data = await medicalConditionLib.addMedicalCondition(obj);
      res.locals.data = data;
      res.locals.message = Messages.SAVED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "MedicalConditionController",
        function_name: "addMedicalCondition",
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

  static updateMedicalCondition = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const input = req.body;
      const conditionId = req.params.id;

      const obj = {
        name: input.name,
        description: input.description,
        symptoms: input.symptoms,
        type: input.type,
        // Add other fields based on your schema
      };

      await medicalConditionLib.updateMedicalCondition(conditionId, obj);

      const data = await medicalConditionLib.getMedicalConditionById(
        conditionId
      );

      res.locals.data = data;
      res.locals.message = Messages.UPDATED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "MedicalConditionController",
        function_name: "updateMedicalCondition",
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

  static deleteMedicalCondition = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const conditionId = req.params.id;

      const result = await medicalConditionLib.deleteMedicalCondition(
        conditionId
      );
      if (!result) throw new Error(Messages.SOMETHING_WENT_WRONG);

      res.locals.message = Messages.DELETED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "MedicalConditionController",
        function_name: "deleteMedicalCondition",
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

  static getMedicalConditionById = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const conditionId = req.params.id;

      const data = await medicalConditionLib.getMedicalConditionById(
        conditionId
      );
      if (!data) res.locals.message = Messages.NO_DATA;

      res.locals.data = data;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "MedicalConditionController",
        function_name: "getMedicalConditionById",
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

  static getAllMedicalConditions = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const data = await medicalConditionLib.getAllMedicalConditions();
      if (!data) res.locals.message = Messages.NO_DATA;

      res.locals.data = data;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "MedicalConditionController",
        function_name: "getAllMedicalConditions",
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

export default MedicalConditionController;
