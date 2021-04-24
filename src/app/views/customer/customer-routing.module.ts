import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CustomerComponent } from "./Manage Customer/customer.component";

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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
