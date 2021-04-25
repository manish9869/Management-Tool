import { environment } from "./../../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import * as moment from "moment";
const BACKEND_URL = environment.apiUrl + "/customer";

@Injectable({ providedIn: "root" })
export class CustomerService {
  private customers: any = [];

  private CustomersUpdated = new Subject<{
    customers: any;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getCustomers() {
    this.http
      .get(BACKEND_URL)
      .pipe(
        map((resData: any) => {
          return {
            customers: resData.data.map((data) => {
              return {
                customer_id: data.customer_id,
                fullname: data.fullname,
                email: data.email,
                address: data.address,
                DOB: data.DOB ? moment(data.DOB).format("DD-MMM-YYYY") : "NA",
              };
            }),
          };
        })
      )
      .subscribe((data: any) => {
        this.customers = data.customers;
        this.CustomersUpdated.next({
          customers: [...this.customers],
        });
      });
  }

  getCustomerUpdateListener() {
    return this.CustomersUpdated.asObservable();
  }

  getCustomer(id: string) {
    return this.http.get(BACKEND_URL + "/" + id);
  }

  addCustomer(customerObj) {
    const CustomerData = customerObj;

    this.http.post(BACKEND_URL, CustomerData).subscribe((responseData) => {
      console.log(responseData);
    });
  }

  updateCustomer(CustomerData, id) {
    this.http.put(BACKEND_URL + id, CustomerData).subscribe((response) => {
      this.router.navigate(["/"]);
    });
  }

  deleteCustomer(CustomerId: string) {
    return this.http.delete(BACKEND_URL + "/" + CustomerId);
  }
}
