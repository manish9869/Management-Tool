import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CustomerComponent } from "./customer/customer.component";
import { ViewCustomerComponent } from "./view-customer/view-customer.component";
import { CustomerAppointmentComponent } from "./customer-appointment/customer-appointment.component";
import { ManageInvoiceComponent } from "./manage-invoice/manage-invoice.component";
import { ViewCaseHistoryComponent } from "./view-case-history/view-case-history.component";
import { CaseHistoryComponent } from "./case-history/case-history.component";

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
      {
        path: "case-history",
        component: CaseHistoryComponent,
        data: {
          title: "Customer Appointment",
        },
      },
      {
        path: "view-case-history",
        component: ViewCaseHistoryComponent,
        data: {
          title: "Customer Appointment",
        },
      },
      {
        path: "manage-invoice",
        component: ManageInvoiceComponent,
        data: {
          title: "Manage Invoice",
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
