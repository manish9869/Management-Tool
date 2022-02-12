import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ChartsModule } from "ng2-charts";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ButtonsModule } from "ngx-bootstrap/buttons";
import { SubscriptionPlanComponent } from "./subscription-plan/subscription-plan.component";
import { SubscriptionMappingComponent } from "./subscription-mapping/subscription-mapping.component";
import { SubscriptionRoutingModule } from "./subscription-routing.module";
import { CommonModule } from "@angular/common";
import { AgGridModule } from "ag-grid-angular";
import { CustomTooltip } from "../helpers/custom-tooltip.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SubscriptionRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    AgGridModule.withComponents([CustomTooltip]),
  ],
  declarations: [SubscriptionPlanComponent,SubscriptionMappingComponent, CustomTooltip],
})
export class SubscriptionModule {}