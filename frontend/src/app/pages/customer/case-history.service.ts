import { environment } from "../../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, map } from "rxjs";
import * as moment from "moment";

const BACKEND_URL = environment.apiUrl + "/case-history";

@Injectable({ providedIn: "root" })
export class CaseHistoryService {
  private caseHistoryUpdated = new Subject<{
    caseHistory: any;
  }>();

  constructor(private http: HttpClient) {}

  getCaseHistoryList() {
    return this.http.get(BACKEND_URL).pipe(
      map((resData: any) => {
        return {
          caseHistory: resData.data.map((data) => {
            return {
              case_id: data.case_id,
              customer_id: data.customer_id.customer_id,
              customer_name: data.customer_id.fullname,
              customer_mobile: data.customer_id.mobile,
              staff_member_id: data.staff_member_id.staff_member_id,
              staff_member_name: data.staff_member_id.fullname,
              case_date: data.case_date
                ? moment(data.case_date).format("DD-MMM-YYYY hh:mm A")
                : "NA",
            };
          }),
        };
      })
    );
  }

  getCaseHistoryUpdateListener() {
    return this.caseHistoryUpdated.asObservable();
  }

  getCaseHistoryById(id: string) {
    return this.http.get(BACKEND_URL + "/" + id);
  }

  addCaseHistory(caseHistoryObj) {
    return this.http.post(BACKEND_URL, caseHistoryObj);
  }

  updateCaseHistory(caseHistoryObj, id) {
    return this.http.patch(BACKEND_URL + "/" + id, caseHistoryObj);
  }

  deleteCaseHistory(caseHistoryId: string) {
    return this.http.delete(BACKEND_URL + "/" + caseHistoryId);
  }
}
