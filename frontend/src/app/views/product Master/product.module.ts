import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ChartsModule } from "ng2-charts";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ButtonsModule } from "ngx-bootstrap/buttons";
import { ManageProductsComponent } from "./manage-products/manage-products.component";
import { ProductRoutingModule } from "./product-routing.module";
import { CommonModule } from "@angular/common";

import { AgGridModule } from "ag-grid-angular";

import { CustomTooltip } from "../helpers/custom-tooltip.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    AgGridModule.withComponents([CustomTooltip]),
  ],
  declarations: [ManageProductsComponent, CustomTooltip],
})
export class ProductModule {}
