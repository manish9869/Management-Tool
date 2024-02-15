import { environment } from "../../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, map } from "rxjs";

const BACKEND_URL = environment.apiUrl + "/invoices";

@Injectable({ providedIn: "root" })
export class ManageInvoiceService {
  private invoices: any = [];
  private manageInvoiceUpdated = new Subject<{
    invoices: any;
  }>();

  constructor(private http: HttpClient) {}

  getInvoiceList() {
    return this.http
      .get(BACKEND_URL)
      .pipe(
        map((resData: any) => {
          return {
            invoices: resData.data.map((data) => {
              return {
                id: data.id,
                invoice_id: data.invoice_id,
                issueDate: data.issueDate,
                status: data.status,
                customer_name: data.customer_id.fullname,
                amountPaid: data.amountPaid.$numberDecimal,
                totalAmount: data.totalAmount.$numberDecimal,
                invoiceNumber: data.invoiceNumber,
              };
            }),
          };
        })
      )
      .subscribe((data: any) => {
        this.invoices = data.invoices;
        this.manageInvoiceUpdated.next({
          invoices: [...this.invoices],
        });
      });
  }

  getInvoiceUpdateListener() {
    return this.manageInvoiceUpdated.asObservable();
  }

  getInvoiceById(id: string) {
    return this.http.get(BACKEND_URL + "/" + id);
  }

  getInvoicesByCase(id: string) {
    return this.http.get(BACKEND_URL + "/case/" + id).pipe(
      map((resData: any) => {
        return {
          invoices: resData.data.map((data) => {
            return {
              id: data.id,
              invoice_id: data.invoice_id,
              issueDate: data.issueDate,
              status: data.status,
              customer_data: data.customer_id,
              case_data: data.case_id,
              pendingAmount: data.pendingAmount.$numberDecimal,
              amountPaid: data.amountPaid.$numberDecimal,
              totalAmount: data.totalAmount.$numberDecimal,
              discount: data.discount.$numberDecimal,
              totalDiscountAmount: data.totalDiscountAmount.$numberDecimal,
              tax: data.tax.$numberDecimal,
              totaltaxAmount: data.totaltaxAmount.$numberDecimal,
              invoiceNumber: data.invoiceNumber,
            };
          }),
        };
      })
    );
  }

  addInvoice(invoiceObj) {
    return this.http.post(BACKEND_URL, invoiceObj);
  }

  updateInvoice(invoiceObj, id) {
    return this.http.patch(BACKEND_URL + "/" + id, invoiceObj);
  }

  deleteInvoice(invoiceId: string) {
    return this.http.delete(BACKEND_URL + "/" + invoiceId);
  }
}
