import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CustomerComponent } from "./customer/customer.component";
import { ViewCustomerComponent } from "./view-customer/view-customer.component";
import { CustomerAppointmentComponent } from "./customer-appointment/customer-appointment.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Customer",
    },
    children: [
      {
        path: "",
        redirectTo: "manage-customer",
      },
      {
        path: "manage-customer",
        component: CustomerComponent,
        data: {
          title: "Manage Customer",
        },
      },
      {
        path: "view-customer",
        component: ViewCustomerComponent,
        data: {
          title: "View Customer",
        },
      },
      {
        path: "customer-appointment",
        component: CustomerAppointmentComponent,
        data: {
          title: "Customer Appointment",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
