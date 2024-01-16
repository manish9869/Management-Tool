import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ExpenseTrackerComponent } from "./expense-tracker/expense-tracker.component";
import { ViewExpenseComponent } from "./view-expense/view-expense.component";
import { RevenueTrackerComponent } from "./revenue-tracker/revenue-tracker.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ExpenseTrackerRoutingModule } from "./expense-tracker-routing.module";
import { AgGridModule } from "ag-grid-angular";

@NgModule({
  declarations: [
    ExpenseTrackerComponent,
    ViewExpenseComponent,
    RevenueTrackerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ExpenseTrackerRoutingModule,
    AgGridModule,
  ],
})
export class ExpenseTrackerModule {}
