import { environment } from "../../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

const BACKEND_URL = environment.apiUrl + "/case-history";

@Injectable({ providedIn: "root" })
export class ManageInvoiceService {
  private manageInvoiceUpdated = new Subject<{
    invoice: any;
  }>();

  constructor(private http: HttpClient) {}
  getInvoiceList() {
    return this.http.get(BACKEND_URL);
  }

  getInvoiceUpdateListener() {
    return this.manageInvoiceUpdated.asObservable();
  }

  getInvoiceById(id: string) {
    return this.http.get(BACKEND_URL + "/" + id);
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
