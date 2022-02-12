import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SubscriptionPlanComponent } from "../subscription/subscription-plan/subscription-plan.component";
import { SubscriptionMappingComponent } from "../subscription/subscription-mapping/subscription-mapping.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Subscription Master",
    },
    children: [
      {
        path: "",
        redirectTo: "manage-subscription",
      },
      {
        path: "manage-subscription",
        component: SubscriptionPlanComponent,
        data: {
          title: "Manage subscription",
        },
      },
      {
        path: "subscription-mapping",
        component:SubscriptionMappingComponent ,
        data: {
          title: "Manage subscription",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscriptionRoutingModule {}
