import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ManageProductsComponent } from "./manage-products/manage-products.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Product Master",
    },
    children: [
      {
        path: "",
        redirectTo: "manage-product",
      },
      {
        path: "manage-product",
        component: ManageProductsComponent,
        data: {
          title: "Manage Product",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
