import { Request, Response } from "express";
import * as ResponseHandler from "../helpers/response.handler";
import Messages from "../common/constants";
import * as customerLib from "../modules/customer/customer.lib";
import moment from "moment";
import * as errorlogs from "../modules/errorlogs/errorlogs.lib";
class CustomerController {
  static addCustomerData = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const input = req.body;

      const obj = {
        fullname: input.fullname,
        email: input.email,
        address: input.address,
        created_user_id: loggedInUser,
      };
      const data = await customerLib.addCustomer(obj);
      res.locals.data = data;
      res.locals.message = Messages.SAVED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "CustomerController",
        function_name: "addCustomerData",
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

  static updateCustomerData = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const input = req.body;
      const customer_id = req.params.id;

      const obj = {
        fullname: input.fullname,
        email: input.email,
        address: input.address,
        updated_user_id: loggedInUser,
      };
      await customerLib.updateCustomerData({ customer_id: customer_id }, obj);

      const data = await customerLib.getCustomerDataById({
        customer_id: customer_id,
      });

      res.locals.data = data;
      res.locals.message = Messages.UPDATED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "CustomerController",
        function_name: "updateCustomerData",
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

  static deleteCustomerData = async (req: Request, res: Response) => {
    const { loggedInUser, masterUserID } = req;
    try {
      const customer_id = req.params.id;

      const result = await customerLib.deleteCustomerData({
        customer_id: customer_id,
      });
      if (!result) throw new Error(Messages.SOMETHING_WENT_WRONG);
      res.locals.message = Messages.DELETED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "CustomerController",
        function_name: "deleteCustomerData",
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

  static getCustomerDataById = async (req: Request, res: Response) => {
    const { loggedInUser, masterUserID } = req;
    try {
      const customer_id = req.params.id;

      const data = await customerLib.getCustomerDataById({
        customer_id: customer_id,
      });
      if (!data) res.locals.message = Messages.NO_DATA;

      res.locals.data = data;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "CustomerController",
        function_name: "getCustomerDataById",
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

  static getAllCustomerData = async (req: Request, res: Response) => {
    const { loggedInUser, masterUserID } = req;
    try {
      const data = await customerLib.getAllCustomerData({});
      if (!data) res.locals.message = Messages.NO_DATA;

      res.locals.data = data;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "CustomerController",
        function_name: "getAllCustomerData",
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

export default CustomerController;
