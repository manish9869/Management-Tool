import { Request, Response } from "express";
import * as ResponseHandler from "../helpers/response.handler";
import Messages from "../common/constants";
import * as subscription_mappingLib from "../modules/subscription_mapping/subscription_mapping.lib";
import moment from "moment";
import * as errorlogs from "../modules/errorlogs/errorlogs.lib";
class Subscription_mappingController {
  static addSubscription_mappingData = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const input = req.body;

      const obj = {
        fullname: input.fullname,
        email: input.email,
        address: input.address,
        DOB: input.DOB,
        created_user_id: loggedInUser,
      };
      const data = await subscription_mappingLib.addSubscription_mapping(obj);
      res.locals.data = data;
      res.locals.message = Messages.SAVED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "Subscription_mappingController",
        function_name: "addSubscription_mappingData",
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

  static updateSubscription_mappingData = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const input = req.body;
      const Subscription_mapping_id = req.params.id;

      const obj = {
        fullname: input.fullname,
        email: input.email,
        address: input.address,
        DOB: input.DOB,
        updated_user_id: loggedInUser,
      };
      await subscription_mappingLib.updateSubscription_mappingData({ Subscription_mapping_id: Subscription_mapping_id }, obj);

      const data = await subscription_mappingLib.getSubscription_mappingDataById({
        Subscription_mapping_id: Subscription_mapping_id,
      });

      res.locals.data = data;
      res.locals.message = Messages.UPDATED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "Subscription_mappingController",
        function_name: "updateSubscription_mappingData",
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

  static deleteSubscription_mappingData = async (req: Request, res: Response) => {
    const { loggedInUser, masterUserID } = req;
    try {
      const Subscription_mapping_id = req.params.id;

      const result = await subscription_mappingLib.deleteSubscription_mappingData({
        Subscription_mapping_id: Subscription_mapping_id,
      });
      if (!result) throw new Error(Messages.SOMETHING_WENT_WRONG);
      res.locals.message = Messages.DELETED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "Subscription_mappingController",
        function_name: "deleteSubscription_mappingData",
        error_message: e,
        req_body: req.body && JSON.stringify(req.body),
        createddate: moment(new Date()).format(),
        created_user_id: loggedInUser,
        master_user_id: masterUserID,
      };
      await errorlogs.addErrorLogs(datalog);
      res.locals.errors = e.message;
      ResponseHandler.JSONERROR(req, res);
    }
  };

  static getSubscription_mappingDataById = async (req: Request, res: Response) => {
    const { loggedInUser, masterUserID } = req;
    try {
      const Subscription_mapping_id = req.params.id;

      const data = await subscription_mappingLib.getSubscription_mappingDataById({
        Subscription_mapping_id: Subscription_mapping_id,
      });
      if (!data) res.locals.message = Messages.NO_DATA;

      res.locals.data = data;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "Subscription_mappingController",
        function_name: "getSubscription_mappingDataById",
        error_message: e,
        req_body: req.body && JSON.stringify(req.body),
        createddate: moment(new Date()).format(),
        created_user_id: loggedInUser,
        master_user_id: masterUserID,
      };
      await errorlogs.addErrorLogs(datalog);

      res.locals.errors = e.message;
      ResponseHandler.JSONERROR(req, res);
    }
  };

  static getAllSubscription_mappingData = async (req: Request, res: Response) => {
    const { loggedInUser, masterUserID } = req;
    try {
      const data = await subscription_mappingLib.getAllSubscription_mappingData({});
      if (!data) res.locals.message = Messages.NO_DATA;

      res.locals.data = data;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "Subscription_mappingController",
        function_name: "getAllSubscription_mappingData",
        error_message: e,
        req_body: req.body && JSON.stringify(req.body),
        createddate: moment(new Date()).format(),
        created_user_id: loggedInUser,
        master_user_id: masterUserID,
      };
      await errorlogs.addErrorLogs(datalog);
      res.locals.errors = e.message;
      ResponseHandler.JSONERROR(req, res);
    }
  };
}

export default Subscription_mappingController;
