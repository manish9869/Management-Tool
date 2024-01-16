import { environment } from "./../../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

const BACKEND_URL = environment.apiUrl + "/treatment"; // Updated endpoint for treatments

@Injectable({ providedIn: "root" })
export class TreatmentService {
  private treatments: any = [];
  private treatmentsUpdated = new Subject<{ treatments: any }>();

  constructor(private http: HttpClient) {}

  async getTreatments() {
    this.http
      .get(BACKEND_URL)
      .pipe(
        map((resData: any) => {
          return {
            treatments: resData.data.map((data) => {
              return {
                id: data._id,
                treatment_id: data.treatment_id, // Updated field names
                name: data.name,
                description: data.description,
                cost: data.cost,
                duration: data.duration,
                type: data.type,
                // Add other fields as needed
              };
            }),
          };
        })
      )
      .subscribe((data: any) => {
        this.treatments = data.treatments;
        this.treatmentsUpdated.next({ treatments: [...this.treatments] });
      });
  }

  getTreatmentUpdateListener() {
    return this.treatmentsUpdated.asObservable();
  }

  getTreatment(id: string) {
    return this.http.get(BACKEND_URL + "/" + id);
  }

  addTreatment(treatmentObj) {
    const treatmentData = treatmentObj;
    return this.http.post(BACKEND_URL, treatmentData);
  }

  updateTreatment(treatmentObj, id) {
    const treatmentData = treatmentObj;
    return this.http.patch(BACKEND_URL + "/" + id, treatmentData);
  }

  deleteTreatment(treatmentId: string) {
    return this.http.delete(BACKEND_URL + "/" + treatmentId);
  }
}
