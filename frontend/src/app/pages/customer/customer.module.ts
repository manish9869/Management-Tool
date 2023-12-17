import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CustomerRoutingModule } from "./customer-routing.module";
import { CommonModule } from "@angular/common";
import { CustomerComponent } from "./customer/customer.component";
import { AgGridModule } from "ag-grid-angular";
import { CustomTooltip } from "../helpers/custom-tooltip.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomerRoutingModule,
    AgGridModule,
  ],
  declarations: [CustomerComponent, CustomTooltip],
})
export class CustomerModule {}
