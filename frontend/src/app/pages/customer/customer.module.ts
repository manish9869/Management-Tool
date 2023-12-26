import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CustomerRoutingModule } from "./customer-routing.module";
import { CommonModule } from "@angular/common";
import { CustomerComponent } from "./customer/customer.component";
import { AgGridModule } from "ag-grid-angular";
import { CustomTooltip } from "../helpers/custom-tooltip.component";
import { ViewCustomerComponent } from "./view-customer/view-customer.component";
import { CustomerAppointmentComponent } from "./customer-appointment/customer-appointment.component";
import { ManageInvoiceComponent } from "./manage-invoice/manage-invoice.component";
import { CaseHistoryComponent } from "./case-history/case-history.component";
import { ViewCaseHistoryComponent } from "./view-case-history/view-case-history.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomerRoutingModule,
    AgGridModule,
  ],
  declarations: [
    CustomerComponent,
    CustomTooltip,
    ViewCustomerComponent,
    CustomerAppointmentComponent,
    ManageInvoiceComponent,
    CaseHistoryComponent,
    ViewCaseHistoryComponent,
  ],
})
export class CustomerModule {}
