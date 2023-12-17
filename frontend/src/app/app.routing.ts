import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { BrowserModule } from "@angular/platform-browser";
import { P404Component } from "./pages/error/404.component";
import { P500Component } from "./pages/error/500.component";
import { AuthGuard } from "./pages/auth/auth.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("src/app/layouts/admin-layout/admin-layout.module").then(
            (m) => m.AdminLayoutModule
          ),
      },
    ],
    //canActivate: [AuthGuard],
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
      import("./pages/auth/auth.module").then((m) => m.AuthModule),
  },

  {
    path: "",
    component: AdminLayoutComponent,
    data: {
      title: "Home",
    },
    children: [
      // {
      //   path: "dashboard",
      //   loadChildren: () =>
      //     import("./views/dashboard/dashboard.module").then(
      //       (m) => m.DashboardModule
      //     ),
      // },
      // {
      //   path: "customer",
      //   loadChildren: () =>
      //     import("./views/customer/customer.module").then(
      //       (m) => m.CustomerModule
      //     ),
      // }
    ],
    canActivate: [AuthGuard],
  },
  { path: "**", component: P404Component },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
