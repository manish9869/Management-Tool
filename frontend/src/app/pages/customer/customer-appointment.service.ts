import { environment } from "../../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, map } from "rxjs";
import { Router } from "@angular/router";
import * as moment from "moment";
const BACKEND_URL = environment.apiUrl + "/appointment";

@Injectable({ providedIn: "root" })
export class CustomerAppointmentService {
  private CustomersUpdated = new Subject<{
    customers: any;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getCustomerAppointments() {
    return this.http.get(BACKEND_URL).pipe(
      map((resData: any) => {
        return {
          appointments: resData.data.map((data) => {
            return {
              appointment_id: data.appointment_id,
              customer_id: data.customer_id.customer_id,
              customer_name: data.customer_id.fullname,
              customer_mobile: data.customer_id.mobile,
              staff_member_id: data.staff_member_id.staff_member_id,
              staff_member_name: data.staff_member_id.fullname,
              appointment_date: data.appointment_date
                ? moment(data.appointment_date).format("DD-MMM-YYYY hh:mm A")
                : "NA",
            };
          }),
        };
      })
    );
  }

  getCustomerAppointmentUpdateListener() {
    return this.CustomersUpdated.asObservable();
  }

  getCustomerAppointment(id: string) {
    return this.http.get(BACKEND_URL + "/" + id);
  }

  addCustomerAppointment(customerObj) {
    const CustomerData = customerObj;
    return this.http.post(BACKEND_URL, CustomerData);
  }

  updateCustomerAppointment(customerObj, id) {
    const CustomerData = customerObj;
    return this.http.patch(BACKEND_URL + "/" + id, CustomerData);
  }

  deleteCustomerAppointment(CustomerId: string) {
    return this.http.delete(BACKEND_URL + "/" + CustomerId);
  }
}
