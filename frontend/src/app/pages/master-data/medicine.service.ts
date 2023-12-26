import { environment } from "../../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import * as moment from "moment";
const BACKEND_URL = environment.apiUrl + "/customer";

@Injectable({ providedIn: "root" })
export class MedicineService {
  constructor(private http: HttpClient, private router: Router) {}
}
