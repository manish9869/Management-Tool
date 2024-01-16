import { environment } from "./../../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import * as moment from "moment";

const BACKEND_URL = environment.apiUrl + "/medical-condition"; // Assuming the API endpoint for medical conditions

@Injectable({ providedIn: "root" })
export class MedicalConditionService {
  private medicalConditions: any = [];

  private MedicalConditionsUpdated = new Subject<{
    medicalConditions: any;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  async getMedicalConditions() {
    this.http
      .get(BACKEND_URL)
      .pipe(
        map((resData: any) => {
          return {
            medicalConditions: resData.data.map((data) => {
              return {
                id: data._id,
                condition_id: data.condition_id,
                name: data.name,
                description: data.description,
                symptoms: data.symptoms,
                type: data.type,
                // Add other fields as needed
              };
            }),
          };
        })
      )
      .subscribe((data: any) => {
        this.medicalConditions = data.medicalConditions;
        this.MedicalConditionsUpdated.next({
          medicalConditions: [...this.medicalConditions],
        });
      });
  }

  getMedicalConditionUpdateListener() {
    return this.MedicalConditionsUpdated.asObservable();
  }

  getMedicalCondition(id: string) {
    return this.http.get(BACKEND_URL + "/" + id);
  }

  addMedicalCondition(medicalConditionObj) {
    const MedicalConditionData = medicalConditionObj;
    return this.http.post(BACKEND_URL, MedicalConditionData);
  }

  updateMedicalCondition(medicalConditionObj, id) {
    const MedicalConditionData = medicalConditionObj;
    return this.http.patch(BACKEND_URL + "/" + id, MedicalConditionData);
  }

  deleteMedicalCondition(conditionId: string) {
    return this.http.delete(BACKEND_URL + "/" + conditionId);
  }
}
