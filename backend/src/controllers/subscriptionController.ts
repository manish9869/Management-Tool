import { Request, Response } from "express";
import * as ResponseHandler from "../helpers/response.handler";
import Messages from "../common/constants";
import * as subscriptionLib from "../modules/subscription/subscription.lib";
import moment from "moment";
import * as errorlogs from "../modules/errorlogs/errorlogs.lib";
class SubscriptionController {
  static addSubscriptionData = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const input = req.body;

      const obj = {
        subscription_plan_name: input.subscription_plan_name,
        price: input.price,
        validity: input.validity,
        created_user_id: loggedInUser,
        createddate: moment(new Date()).format(),
      };
      const data = await subscriptionLib.addSubscription(obj);
      res.locals.data = data;
      res.locals.message = Messages.SAVED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "SubscriptionController",
        function_name: "addSubscriptionData",
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

  static updateSubscriptionData = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const input = req.body;
      const Subscription_id = req.params.id;

      const obj = {
        subscription_plan_name: input.subscription_plan_name,
        price: input.price,
        validity: input.validity,
        updated_user_id: loggedInUser,
      };
      await subscriptionLib.updateSubscriptionData({ subscription_id: Subscription_id }, obj);

      const data = await subscriptionLib.getSubscriptionDataById({
        subscription_id: Subscription_id,
      });

      res.locals.data = data;
      res.locals.message = Messages.UPDATED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "SubscriptionController",
        function_name: "updateSubscriptionData",
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

  static deleteSubscriptionData = async (req: Request, res: Response) => {
    const { loggedInUser, masterUserID } = req;
    try {
      const Subscription_id = req.params.id;

      const result = await subscriptionLib.deleteSubscriptionData({
        subscription_id: Subscription_id,
      });
      if (!result) throw new Error(Messages.SOMETHING_WENT_WRONG);
      res.locals.message = Messages.DELETED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "SubscriptionController",
        function_name: "deleteSubscriptionData",
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

  static getSubscriptionDataById = async (req: Request, res: Response) => {
    const { loggedInUser, masterUserID } = req;
    try {
      const Subscription_id = req.params.id;

      const data = await subscriptionLib.getSubscriptionDataById({
        subscription_id: Subscription_id,
      });
      if (!data) res.locals.message = Messages.NO_DATA;

      res.locals.data = data;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "SubscriptionController",
        function_name: "getSubscriptionDataById",
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

  static getAllSubscriptionData = async (req: Request, res: Response) => {
    const { loggedInUser, masterUserID } = req;
    try {
      const data = await subscriptionLib.getAllSubscriptionData({});
      if (!data) res.locals.message = Messages.NO_DATA;

      res.locals.data = data;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "SubscriptionController",
        function_name: "getAllSubscriptionData",
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

export default SubscriptionController;
