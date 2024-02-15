import { Request, Response } from "express";
import * as ResponseHandler from "../helpers/response.handler";
import Messages from "../common/constants";
import * as invoiceLib from "../modules/invoice/invoice.lib";
import moment from "moment";
import * as errorlogs from "../modules/errorlogs/errorlogs.lib";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import ejs from "ejs";
const PuppeteerHTMLPDF = require("puppeteer-html-pdf");

const htmlPDF = new PuppeteerHTMLPDF();
htmlPDF.setOptions({
  format: "A4",
  scale: 1.5,
  printBackground: true,
});

class InvoiceController {
  static addInvoiceData = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const input = req.body;
      const obj = {
        invoiceNumber: uuidv4(),
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
        status: input.status,
        totalDiscountAmount: input.totalDiscountAmount || 0,
        totaltaxAmount: input.totaltaxAmount || 0,
        pendingAmount: input.pendingAmount || 0,
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
        status: input.status,
        totalDiscountAmount: input.totalDiscountAmount || 0,
        totaltaxAmount: input.totaltaxAmount || 0,
        pendingAmount: input.pendingAmount || 0,
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

  static getAllInvoicesByCaseId = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const case_id = req.params.id;
      const data = await invoiceLib.getAllInvoices({
        case_id: case_id,
      });
      if (!data) res.locals.message = Messages.NO_DATA;

      res.locals.data = data;
      ResponseHandler.JSONSUCCESS(req, res);
    } catch (e) {
      let datalog = {
        pagename: "InvoiceController",
        function_name: "getAllInvoicesByCaseId",
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

  static downloadInvoice = async (req: Request, res: Response) => {
    const { loggedInUser } = req;
    try {
      const invoiceId = req.params.id;
      const data: any = await invoiceLib.getInvoiceById({
        invoice_id: invoiceId,
      });
      if (!data) res.locals.message = Messages.NO_DATA;

      const html = await htmlPDF.readFile(
        __dirname + "./../templates/invoice.ejs",
        "utf8"
      );

      console.log("data.totalAmount", parseFloat(data.totalAmount).toFixed(2));

      let renderedData = {
        date: new Date(data.issueDate).toDateString(),
        invoiceNumber: data.invoiceNumber,
        senderName: data.customer_id.fullname,
        senderContact: data.customer_id.mobile,
        receiverName: data.case_id.staff_member_id.fullname,
        receiverContact: data.case_id.staff_member_id.mobile,
        treatments: data.case_id.treatment_ids.map((treatment) => ({
          name: treatment.name,
          cost: `₹ ${parseFloat(treatment.cost).toFixed(2)}/-`,
        })),
        medicalConditions: data.case_id.condition_ids.map((condition) => ({
          name: condition.name,
        })),
        medicines: data.case_id.medicine_ids.map((medicine) => ({
          name: medicine.name,
        })),
        subTotal: `₹ ${parseFloat(data.totalAmount.toString()).toFixed(2)}`,
        tax: `${parseFloat(data.tax).toFixed(2)}`,
        discount: `${parseFloat(data.discount).toFixed(2)}`,
        totaltaxAmount: `₹ ${parseFloat(data.totaltaxAmount).toFixed(2)}`,
        totalDiscountAmount: `₹ ${parseFloat(data.totalDiscountAmount).toFixed(
          2
        )}`,
        totalAmount: `₹ ${parseFloat(data.totalAmount).toFixed(2)}`,
        paidAmount: `₹ ${parseFloat(data.amountPaid).toFixed(2)}`,
        amountDue: `₹ ${parseFloat(data.pendingAmount).toFixed(2)}`,
        paymentMode: data.paymentMode,
        note: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque, dicta distinctio! Laudantium voluptatibus est nemo.",
      };
      console.log("renderedData===>", renderedData);
      const renderedHtml = ejs.render(html, renderedData);

      try {
        const pdfBuffer = await htmlPDF.create(renderedHtml);
        const fileName = `invoice_${invoiceId}.pdf`;
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${fileName}"`
        );
        res.send(pdfBuffer);
      } catch (error) {
        console.log("PuppeteerHTMLPDF error", error);
      }
    } catch (e) {
      let datalog = {
        pagename: "InvoiceController",
        function_name: "downloadInvoice",
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
