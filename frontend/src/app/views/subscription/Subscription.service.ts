import { environment } from "./../../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import * as moment from "moment";
const BACKEND_URL = environment.apiUrl + "/customer";

@Injectable({ providedIn: "root" })
export class SubscriptionService {
  private subscriptions: any = [];

  private SubscriptionUpdated = new Subject<{
    subscriptions: any;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getSubscriptions() {
    this.http
      .get(BACKEND_URL)
      .pipe(
        map((resData: any) => {
          return {
            subscriptions: resData.data.map((data) => {
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
        this.subscriptions = data.subscriptions;
        this.SubscriptionUpdated.next({
          subscriptions: [...this.subscriptions],
        });
      });
  }

  getSubscriptioUpdateListener() {
    return this.SubscriptionUpdated.asObservable();
  }

  getSubscription(id: string) {
    return this.http.get(BACKEND_URL + "/" + id);
  }

  addCustomer(subscriptionsObj) {
    const SubscriptionData = subscriptionsObj;

    return this.http.post(BACKEND_URL, SubscriptionData);
  }

  updateSubscriptio(subscriptionsObj, id) {
    const SubscriptionData = subscriptionsObj;
    return this.http.patch(BACKEND_URL + "/" + id, SubscriptionData);
  }

  deleteSubscriptio(SubscriptionId: string) {
    return this.http.delete(BACKEND_URL + "/" + SubscriptionId);
  }
}
