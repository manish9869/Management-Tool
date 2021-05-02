import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ChartsModule } from "ng2-charts";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ButtonsModule } from "ngx-bootstrap/buttons";
import { CustomerComponent } from "./Manage Customer/customer.component";
import { CustomerRoutingModule } from "./customer-routing.module";
import { CommonModule } from "@angular/common";

import { AgGridModule } from "ag-grid-angular";

import { CustomTooltip } from "./../helpers/custom-tooltip.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomerRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    AgGridModule.withComponents([CustomTooltip]),
  ],
  declarations: [CustomerComponent, CustomTooltip],
})
export class CustomerModule {}
