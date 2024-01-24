import { Request, Response } from "express";
import * as ResponseHandler from "../helpers/response.handler";
import Messages from "../common/constants";
import * as invoiceLib from "../modules/invoice/invoice.lib";
import moment from "moment";
import * as errorlogs from "../modules/errorlogs/errorlogs.lib";
import mongoose from "mongoose";
class InvoiceController {
  static addInvoiceData = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const input = req.body;
      const obj = {
        invoiceNumber: input.invoiceNumber,
        case_id: mongoose.Types.ObjectId.createFromHexString(input.case_id),
        customer_id: mongoose.Types.ObjectId.createFromHexString(
          input.customer_id
        ),
        discount: input.discount || 0,
        tax: input.tax || 0,
        totalAmount: input.totalAmount,
        paymentMode: input.paymentMode,
        amountPaid: input.amountPaid || 0,
        issueDate: input.issueDate || new Date(),
        dueDate: input.dueDate || new Date(),
        status: input.status || "Draft",
      };
      const data = await invoiceLib.addInvoice(obj);
      res.locals.data = data;
      res.locals.message = Messages.SAVED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "InvoiceController",
        function_name: "addInvoiceData",
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

  static updateInvoiceData = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const input = req.body;
      const invoiceId = req.params.id;

      const obj = {
        invoiceNumber: input.invoiceNumber,
        case_id: mongoose.Types.ObjectId.createFromHexString(input.case_id),
        customer_id: mongoose.Types.ObjectId.createFromHexString(
          input.customer_id
        ),
        discount: input.discount || 0,
        tax: input.tax || 0,
        totalAmount: input.totalAmount,
        paymentMode: input.paymentMode,
        amountPaid: input.amountPaid || 0,
        issueDate: input.issueDate || new Date(),
        dueDate: input.dueDate || new Date(),
        status: input.status || "Draft",
      };
      await invoiceLib.updateInvoiceData({ invoice_id: invoiceId }, obj);

      const data = await invoiceLib.getInvoiceById({
        invoice_id: invoiceId,
      });

      res.locals.data = data;
      res.locals.message = Messages.UPDATED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "InvoiceController",
        function_name: "updateInvoiceData",
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

  static deleteInvoiceData = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const invoiceId = req.params.id;

      const result = await invoiceLib.deleteInvoice({
        invoice_id: invoiceId,
      });
      if (!result) throw new Error(Messages.SOMETHING_WENT_WRONG);
      res.locals.message = Messages.DELETED;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "InvoiceController",
        function_name: "deleteInvoiceData",
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

  static getInvoiceDataById = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const invoiceId = req.params.id;

      const data = await invoiceLib.getInvoiceById({
        invoice_id: invoiceId,
      });
      if (!data) res.locals.message = Messages.NO_DATA;

      res.locals.data = data;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "InvoiceController",
        function_name: "getInvoiceDataById",
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

  static getAllInvoiceData = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const data = await invoiceLib.getAllInvoices({});
      if (!data) res.locals.message = Messages.NO_DATA;

      res.locals.data = data;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "InvoiceController",
        function_name: "getAllInvoiceData",
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

export default InvoiceController;
