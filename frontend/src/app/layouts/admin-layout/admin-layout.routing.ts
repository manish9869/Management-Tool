import { Routes } from "@angular/router";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { UserProfileComponent } from "../../pages/user-profile/user-profile.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "user-profile", component: UserProfileComponent },
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
    ],
    // canActivate: [AuthGuard],
  },
];
