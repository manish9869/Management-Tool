import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Import Containers
import { DefaultLayoutComponent } from "./containers";
import { AuthGuard } from "./views/auth/auth.guard";

import { P404Component } from "./views/error/404.component";
import { P500Component } from "./views/error/500.component";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  {
    path: "404",
    component: P404Component,
    data: {
      title: "Page 404",
    },
  },
  {
    path: "500",
    component: P500Component,
    data: {
      title: "Page 500",
    },
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./views/auth/auth.module").then((m) => m.AuthModule),
  },
  {
    path: "",
    component: DefaultLayoutComponent,
    data: {
      title: "Home",
    },
    children: [
      {
        path: "dashboard",
        loadChildren: () =>
          import("./views/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: "customer",
        loadChildren: () =>
          import("./views/customer/customer.module").then(
            (m) => m.CustomerModule
          ),
      },
      {
        path: "product",
        loadChildren: () =>
          import("./views/product Master/product.module").then(
            (m) => m.ProductModule
          ),
      },
      {
        path: "subscription",
        loadChildren: () =>
          import("./views/subscription/subscription.module").then(
            (m) => m.SubscriptionModule
          ),
      },
    ],
    //canActivate: [AuthGuard],
  },
  { path: "**", component: P404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
