import { NgModule } from "@angular/core";
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
import { NgSelectModule } from "@ng-select/ng-select";
import { Ng2FlatpickrModule } from "ng2-flatpickr";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  imports: [
    Ng2FlatpickrModule,
    NgSelectModule,
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
