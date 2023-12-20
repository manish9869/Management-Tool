import { Request, Response } from "express";
import moment from "moment";
import * as ResponseHandler from "../helpers/response.handler";
import Messages from "../common/constants";
import * as staffMemberLib from "../modules/staff-memebers/staff-memebers.lib";
import * as errorlogs from "../modules/errorlogs/errorlogs.lib";

class StaffMemberController {
  static addStaffMember = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const inputData = req.body;
      const newStaffMemberData = {
        fullname: inputData.fullname,
        email: inputData.email,
        address: inputData.address,
        position: inputData.position,
        specialization: inputData.specialization,
        consultation_fee: inputData.consultation_fee,
        qualification: inputData.qualification,
        DOB: inputData.DOB,
        mobile: inputData.mobile,
        alt_mobile: inputData.alt_mobile,
        created_user_id: loggedInUser,
      };

      const addedStaffMember = await staffMemberLib.addStaffMember(
        newStaffMemberData
      );
      res.locals.data = addedStaffMember;
      res.locals.message = Messages.SAVED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (error) {
      const logData = {
        pagename: "staffMemberController",
        function_name: "addStaffMember",
        error_message: error.message,
        req_body: req.body,
        createddate: moment(new Date()).format(),
        created_user_id: loggedInUser,
      };

      await errorlogs.addErrorLogs(logData);
      res.locals.errors = error.message;
      ResponseHandler.JSONERROR(req, res);
    }
  };

  static updateStaffMember = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const inputData = req.body;
      const staffMemberId = parseInt(req.params.id);

      const isStaffExist = await staffMemberLib.getStaffMemberById({
        staff_member_id: staffMemberId,
      });

      if (isStaffExist) {
        const updatedStaffMemberData = {
          fullname: inputData.fullname,
          email: inputData.email,
          position: inputData.position,
          address: inputData.address,
          specialization: inputData.specialization,
          consultation_fee: inputData.consultation_fee,
          qualification: inputData.qualification,
          DOB: inputData.DOB,
          mobile: inputData.mobile,
          alt_mobile: inputData.alt_mobile,
          updated_user_id: loggedInUser,
        };

        await staffMemberLib.updateStaffMember(
          { staff_member_id: staffMemberId },
          updatedStaffMemberData
        );

        const updatedStaffMember = await staffMemberLib.getStaffMemberById({
          staff_member_id: staffMemberId,
        });
        res.locals.data = updatedStaffMember;
        res.locals.message = Messages.UPDATED;
        ResponseHandler.JSONSUCCESS(req, res);
      } else {
        res.locals.errors = Messages.USER_DOES_NOT_EXIST;
        ResponseHandler.JSONERROR(req, res);
      }
    } catch (error) {
      const logData = {
        pagename: "staffMemberController",
        function_name: "updateStaffMember",
        error_message: error.message,
        req_body: req.body && JSON.stringify(req.body),
        createddate: moment(new Date()).format(),
        created_user_id: loggedInUser,
      };

      await errorlogs.addErrorLogs(logData);
      res.locals.errors = error.message;
      ResponseHandler.JSONERROR(req, res);
    }
  };

  static deleteStaffMember = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const staffMemberId = req.params.id;

      const result = await staffMemberLib.deleteStaffMemberById({
        staff_member_id: staffMemberId,
      });
      if (!result) throw new Error(Messages.SOMETHING_WENT_WRONG);
      res.locals.message = Messages.DELETED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (error) {
      const logData = {
        pagename: "staffMemberController",
        function_name: "deleteStaffMember",
        error_message: error.message,
        req_body: req.body && JSON.stringify(req.body),
        createddate: moment(new Date()).format(),
        created_user_id: loggedInUser,
      };

      await errorlogs.addErrorLogs(logData);
      res.locals.errors = error.message;
      ResponseHandler.JSONERROR(req, res);
    }
  };

  static getStaffMemberById = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const staffMemberId = req.params.id;

      const staffMemberData = await staffMemberLib.getStaffMemberById({
        staff_member_id: staffMemberId,
      });
      if (!staffMemberData) res.locals.message = Messages.NO_DATA;

      res.locals.data = staffMemberData;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (error) {
      const logData = {
        pagename: "staffMemberController",
        function_name: "getStaffMemberById",
        error_message: error.message,
        req_body: req.body && JSON.stringify(req.body),
        createddate: moment(new Date()).format(),
        created_user_id: loggedInUser,
      };

      await errorlogs.addErrorLogs(logData);
      res.locals.errors = error.message;
      ResponseHandler.JSONERROR(req, res);
    }
  };

  static getAllStaffMembers = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const allStaffMembers = await staffMemberLib.getAllStaffMembers();
      if (!allStaffMembers) res.locals.message = Messages.NO_DATA;

      res.locals.data = allStaffMembers;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (error) {
      const logData = {
        pagename: "staffMemberController",
        function_name: "getAllStaffMembers",
        error_message: error.message,
        req_body: req.body && JSON.stringify(req.body),
        createddate: moment(new Date()).format(),
        created_user_id: loggedInUser,
      };

      await errorlogs.addErrorLogs(logData);
      res.locals.errors = error.message;
      ResponseHandler.JSONERROR(req, res);
    }
  };
}

export default StaffMemberController;
