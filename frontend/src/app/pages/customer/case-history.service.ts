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
        const caseHistory = resData.data.map((data) => {
          const conditions = data.condition_ids.map(
            (condition) => condition.name
          );
          const treatments = data.treatment_ids.map(
            (treatment) => treatment.name
          );
          const medicines = data.medicine_ids.map((medicine) => medicine.name);

          return {
            case_id: data.case_id,
            customer_id: data.customer_id.id,
            customer_name: data.customer_id.fullname,
            customer_mobile: data.customer_id.mobile,
            staff_member_id: data.staff_member_id.id,
            staff_member_name: data.staff_member_id.fullname,
            case_date: data.case_date
              ? moment(data.case_date).format("DD-MMM-YYYY hh:mm A")
              : "NA",
            conditions,
            treatments,
            medicines,
          };
        });

        return {
          caseHistory,
        };
      })
    );
  }

  getCaseHistoryUpdateListener() {
    return this.caseHistoryUpdated.asObservable();
  }

  getCaseHistoryById(id: string) {
    return this.http.get(BACKEND_URL + "/" + id).pipe(
      map((data: any) => {
        data = data.data;
        const conditions = data.condition_ids.map((condition) => condition.id);
        const treatments = data.treatment_ids.map((treatment) => treatment.id);
        const medicines = data.medicine_ids.map((medicine) => medicine.id);

        return {
          case_id: data.case_id,
          customer_id: data.customer_id.id,
          staff_member_id: data.staff_member_id.id,
          dental_history: data.dental_history,
          medical_history: data.medical_history,
          notes: data.notes,
          case_documents: data.case_documents,
          case_date: data.case_date
            ? moment(data.case_date).format("DD-MMM-YYYY hh:mm A")
            : "NA",
          conditions,
          treatments,
          medicines,
        };
      })
    );
  }

  addCaseHistory(caseHistoryObj) {
    return this.http.post(BACKEND_URL, caseHistoryObj);
  }

  updateCaseHistory(caseHistoryObj, id) {
    return this.http.patch(BACKEND_URL + "/" + id, caseHistoryObj);
  }

  updateCaseHistoryMediaData(caseHistoryObj, id) {
    return this.http.patch(BACKEND_URL + "/update-media/" + id, caseHistoryObj);
  }

  deleteCaseHistory(caseHistoryId: string) {
    return this.http.delete(BACKEND_URL + "/" + caseHistoryId);
  }

  public removeUploadedFile(fileName: string) {
    return this.http.delete(`${BACKEND_URL}/delete-image/${fileName}`);
  }
}
