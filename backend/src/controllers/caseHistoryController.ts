import { Request, Response } from "express";
import * as ResponseHandler from "../helpers/response.handler";
import Messages from "../common/constants";
import * as caseHistoryLib from "../modules/case-history/case-history.lib";
import moment from "moment";
import * as errorlogs from "../modules/errorlogs/errorlogs.lib";
import mongoose from "mongoose";

class CaseHistoryController {
  static addCaseHistoryData = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      let medicineIds = [];
      let treatmentIds = [];
      let conditionIds = [];
      const input = req.body;
      if (input.medicine_ids) {
        medicineIds = input.medicine_ids.map((id) =>
          mongoose.Types.ObjectId.createFromHexString(id)
        );
      }
      if (input.treatment_ids) {
        treatmentIds = input.treatment_ids.map((id) =>
          mongoose.Types.ObjectId.createFromHexString(id)
        );
      }
      if (input.condition_ids) {
        conditionIds = input.condition_ids.map((id) =>
          mongoose.Types.ObjectId.createFromHexString(id)
        );
      }
      const obj = {
        customer_id: mongoose.Types.ObjectId.createFromHexString(
          input.customer_id
        ),
        staff_member_id: mongoose.Types.ObjectId.createFromHexString(
          input.staff_member_id
        ),
        case_date: input.case_date,
        notes: input.notes,
        condition_ids: conditionIds,
        treatment_ids: treatmentIds,
        medicine_ids: medicineIds,
        dental_history: input.dental_history,
        medical_history: input.medical_history,
        case_documents: input.case_documents,
        created_user_id: loggedInUser,
      };

      const data = await caseHistoryLib.addCaseHistory(obj);
      res.locals.data = data;
      res.locals.message = Messages.SAVED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "CaseHistoryController",
        function_name: "addCaseHistoryData",
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

  static updateCaseHistoryData = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const case_id = req.params.id;
      let medicineIds = [];
      let treatmentIds = [];
      let conditionIds = [];
      const input = req.body;
      if (input.medicine_ids) {
        medicineIds = input.medicine_ids.map((id) =>
          mongoose.Types.ObjectId.createFromHexString(id)
        );
      }
      if (input.treatment_ids) {
        treatmentIds = input.treatment_ids.map((id) =>
          mongoose.Types.ObjectId.createFromHexString(id)
        );
      }
      if (input.condition_ids) {
        conditionIds = input.condition_ids.map((id) =>
          mongoose.Types.ObjectId.createFromHexString(id)
        );
      }
      const obj = {
        customer_id: mongoose.Types.ObjectId.createFromHexString(
          input.customer_id
        ),
        staff_member_id: mongoose.Types.ObjectId.createFromHexString(
          input.staff_member_id
        ),
        case_date: input.case_date,
        notes: input.notes,
        condition_ids: conditionIds,
        treatment_ids: treatmentIds,
        medicine_ids: medicineIds,
        dental_history: input.dental_history,
        medical_history: input.medical_history,
        case_documents: input.case_documents,
        updated_user_id: loggedInUser,
      };

      await caseHistoryLib.updateCaseHistoryData({ case_id: case_id }, obj);

      const data = await caseHistoryLib.getCaseHistoryById({
        case_id: case_id,
      });

      res.locals.data = data;
      res.locals.message = Messages.UPDATED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "CaseHistoryController",
        function_name: "updateCaseHistoryData",
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

  static deleteCaseHistoryData = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const case_id = req.params.id;

      const result = await caseHistoryLib.deleteCaseHistoryData({
        case_id: case_id,
      });
      if (!result) throw new Error(Messages.SOMETHING_WENT_WRONG);
      res.locals.message = Messages.DELETED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "CaseHistoryController",
        function_name: "deleteCaseHistoryData",
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

  static getCaseHistoryById = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const case_id = req.params.id;

      const data = await caseHistoryLib.getCaseHistoryById({
        case_id: case_id,
      });
      if (!data) res.locals.message = Messages.NO_DATA;

      res.locals.data = data;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "CaseHistoryController",
        function_name: "getCaseHistoryById",
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

  static getAllCaseHistoryData = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const data = await caseHistoryLib.getAllCaseHistoryData({});
      if (!data) res.locals.message = Messages.NO_DATA;

      res.locals.data = data;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "CaseHistoryController",
        function_name: "getAllCaseHistoryData",
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

export default CaseHistoryController;
