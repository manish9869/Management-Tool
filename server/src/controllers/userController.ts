import { Request, Response } from "express";
import * as ResponseHandler from "../helpers/response.handler";
import Messages from "../common/constants";
import * as userLib from "../modules/User/User.lib";
import moment from "moment";
import * as errorlogs from "../modules/errorlogs/errorlogs.lib";
import { generatePassword } from "../helpers/auth.helpers";
class UserController {
  static addUserData = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const input = req.body;

      const obj = {
        user_name: input.user_name,
        password: await generatePassword(input.password),
        name: input.name,
        user_email: input.user_email,
        role_id: input.role_id,
        profile_img: input.profile_img,
      };

      const data = await userLib.addUser(obj);
      res.locals.data = data;
      res.locals.message = Messages.SAVED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "UserController",
        function_name: "addUserData",
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

  static updateUserData = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const input = req.body;
      const user_id = req.params.id;

      const obj = {
        user_name: input.user_name,
        password: await generatePassword(input.password),
        name: input.name,
        user_email: input.user_email,
        role_id: input.role_id,
        status: input.status,
        profile_img: input.profile_img,
      };
      await userLib.updateUserData({ user_id: user_id }, obj);

      const data = await userLib.getUserDataById({
        user_id: user_id,
      });

      res.locals.data = data;
      res.locals.message = Messages.UPDATED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "UserController",
        function_name: "updateUserData",
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

  static deleteUserData = async (req: Request, res: Response) => {
    const { loggedInUser, masterUserID } = req;
    try {
      const user_id = req.params.id;

      const result = await userLib.deleteUserData({
        user_id: user_id,
      });
      if (!result) throw new Error(Messages.SOMETHING_WENT_WRONG);
      res.locals.message = Messages.DELETED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "UserController",
        function_name: "deleteUserData",
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

  static getUserDataById = async (req: Request, res: Response) => {
    const { loggedInUser, masterUserID } = req;
    try {
      const user_id = req.params.id;

      const data = await userLib.getUserDataById({
        user_id: user_id,
      });
      if (!data) res.locals.message = Messages.NO_DATA;

      res.locals.data = data;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "UserController",
        function_name: "getUserDataById",
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

  static getAllUserData = async (req: Request, res: Response) => {
    const { loggedInUser, masterUserID } = req;
    try {
      const data = await userLib.getAllUserData({});
      if (!data) res.locals.message = Messages.NO_DATA;

      res.locals.data = data;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "UserController",
        function_name: "getAllUserData",
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

export default UserController;
