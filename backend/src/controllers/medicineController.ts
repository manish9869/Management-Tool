import { Request, Response } from "express";
import * as ResponseHandler from "../helpers/response.handler";
import Messages from "../common/constants";
import * as medicineLib from "../modules/medicine/medicine.lib";
import moment from "moment";
import * as errorlogs from "../modules/errorlogs/errorlogs.lib";

class MedicineController {
  static addMedicineData = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const input = req.body;

      const medicineData = {
        name: input.name,
        description: input.description,
        created_user_id: loggedInUser,
      };

      const data = await medicineLib.addMedicine(medicineData);

      res.locals.data = data;
      res.locals.message = Messages.SAVED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "MedicineController",
        function_name: "addMedicineData",
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

  static updateMedicineData = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const input = req.body;
      const medicineId = req.params.id;

      const medicineData = {
        name: input.name,
        description: input.description,
        updated_user_id: loggedInUser,
      };

      console.log("medicineData", medicineData);

      await medicineLib.updateMedicineData(
        { medicine_id: medicineId },
        medicineData
      );

      const data = await medicineLib.getMedicineDataById({
        medicine_id: medicineId,
      });

      res.locals.data = data;
      res.locals.message = Messages.UPDATED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "MedicineController",
        function_name: "updateMedicineData",
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

  static deleteMedicineData = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const medicineId = req.params.id;

      const result = await medicineLib.deleteMedicineData({
        medicine_id: medicineId,
      });
      if (!result) throw new Error(Messages.SOMETHING_WENT_WRONG);
      res.locals.message = Messages.DELETED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "MedicineController",
        function_name: "deleteMedicineData",
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

  static getMedicineDataById = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const medicineId = req.params.id;

      const data = await medicineLib.getMedicineDataById({
        medicine_id: medicineId,
      });
      if (!data) res.locals.message = Messages.NO_DATA;

      res.locals.data = data;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "MedicineController",
        function_name: "getMedicineDataById",
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

  static getAllMedicineData = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const data = await medicineLib.getAllMedicineData({});
      if (!data) res.locals.message = Messages.NO_DATA;

      res.locals.data = data;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "MedicineController",
        function_name: "getAllMedicineData",
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

export default MedicineController;
