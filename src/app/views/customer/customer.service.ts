import { environment } from "./../../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { Customer } from "./Manage Customer/customer.model";
const BACKEND_URL = environment.apiUrl + "/customer";

@Injectable({ providedIn: "root" })
export class CustomerService {
  private Customers: Customer[] = [];
  private CustomersUpdated = new Subject<{
    Customers: Customer[];
    CustomerCount: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getCustomers(CustomersPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${CustomersPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; Customers: any; maxCustomers: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((CustomerData) => {
          return {
            Customers: CustomerData.Customers.map((Customer) => {
              return {
                title: Customer.title,
                content: Customer.content,
                id: Customer._id,
                imagePath: Customer.imagePath,
                creator: Customer.creator,
              };
            }),
            maxCustomers: CustomerData.maxCustomers,
          };
        })
      )
      .subscribe((transformedCustomerData) => {
        this.Customers = transformedCustomerData.Customers;
        this.CustomersUpdated.next({
          Customers: [...this.Customers],
          CustomerCount: transformedCustomerData.maxCustomers,
        });
      });
  }

  getCustomerUpdateListener() {
    return this.CustomersUpdated.asObservable();
  }

  getCustomer(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addCustomer(title: string, content: string, image: File) {
    const CustomerData = new FormData();
    CustomerData.append("title", title);
    CustomerData.append("content", content);
    CustomerData.append("image", image, title);
    this.http
      .post<{ message: string; Customer: Customer }>(BACKEND_URL, CustomerData)
      .subscribe((responseData) => {
        this.router.navigate(["/"]);
      });
  }

  updateCustomer(
    id: string,
    title: string,
    content: string,
    image: File | string
  ) {
    let CustomerData: Customer | FormData;
    if (typeof image === "object") {
      CustomerData = new FormData();
      CustomerData.append("id", id);
      CustomerData.append("title", title);
      CustomerData.append("content", content);
      CustomerData.append("image", image, title);
    } else {
      CustomerData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null,
      };
    }
    this.http.put(BACKEND_URL + id, CustomerData).subscribe((response) => {
      this.router.navigate(["/"]);
    });
  }

  deleteCustomer(CustomerId: string) {
    return this.http.delete(BACKEND_URL + "/" + CustomerId);
  }
}
