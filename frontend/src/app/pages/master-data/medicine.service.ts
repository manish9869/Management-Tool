import { environment } from "./../../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

const BACKEND_URL = environment.apiUrl + "/medicine"; // Assuming the API endpoint for medicines

@Injectable({ providedIn: "root" })
export class MedicineService {
  private medicines: any = [];

  private MedicinesUpdated = new Subject<{ medicines: any }>();

  constructor(private http: HttpClient) {}

  async getMedicines() {
    this.http
      .get(BACKEND_URL)
      .pipe(
        map((resData: any) => {
          return {
            medicines: resData.data.map((data) => {
              return {
                id: data._id,
                medicine_id: data.medicine_id,
                medicineName: data.name,
                description: data.description,
                // Add other fields as needed
              };
            }),
          };
        })
      )
      .subscribe((data: any) => {
        this.medicines = data.medicines;
        this.MedicinesUpdated.next({
          medicines: [...this.medicines],
        });
      });
  }

  getMedicineUpdateListener() {
    return this.MedicinesUpdated.asObservable();
  }

  getMedicine(id: string) {
    return this.http.get(BACKEND_URL + "/" + id);
  }

  addMedicine(medicineObj) {
    const medicineData = medicineObj;
    return this.http.post(BACKEND_URL, medicineData);
  }

  updateMedicine(medicineObj, id) {
    const medicineData = medicineObj;
    return this.http.patch(BACKEND_URL + "/" + id, medicineData);
  }

  deleteMedicine(medicineId: string) {
    return this.http.delete(BACKEND_URL + "/" + medicineId);
  }
}
