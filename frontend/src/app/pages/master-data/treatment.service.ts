import { environment } from "../../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import * as moment from "moment";
import { Router } from "@angular/router";
const BACKEND_URL = environment.apiUrl + "/customer";

@Injectable({ providedIn: "root" })
export class TreatmentService {
  constructor(private http: HttpClient, private router: Router) {}
}
