import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ExpenseTrackerComponent } from "./expense-tracker/expense-tracker.component";
import { ViewExpenseComponent } from "./view-expense/view-expense.component";
import { RevenueTrackerComponent } from "./revenue-tracker/revenue-tracker.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Manage Expense",
    },
    children: [
      {
        path: "",
        redirectTo: "expense-tracker",
      },
      {
        path: "manage-expense-tracker",
        component: ExpenseTrackerComponent,
        data: {
          title: "Manage Expense",
        },
      },
      {
        path: "view-expense",
        component: ViewExpenseComponent,
        data: {
          title: "View Expense",
        },
      },
      {
        path: "revenue-tracker",
        component: RevenueTrackerComponent,
        data: {
          title: "Revenue Tracker",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpenseTrackerRoutingModule {}
