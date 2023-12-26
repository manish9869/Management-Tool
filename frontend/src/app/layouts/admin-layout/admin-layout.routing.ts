import { Routes } from "@angular/router";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  {
    path: "",
    children: [
      {
        path: "customer",
        loadChildren: () =>
          import("src/app/pages/customer/customer.module").then(
            (m) => m.CustomerModule
          ),
      },
      {
        path: "staff",
        loadChildren: () =>
          import("src/app/pages/staff-members/staff-member.module").then(
            (m) => m.StaffMemberModule
          ),
      },
      {
        path: "master-data",
        loadChildren: () =>
          import("src/app/pages/master-data/master-data.module").then(
            (m) => m.MasterDataModule
          ),
      },
    ],
    // canActivate: [AuthGuard],
  },
];
