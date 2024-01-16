import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CommonModule } from "@angular/common";
import { AgGridModule } from "ag-grid-angular";
import { MasterDataRoutingModule } from "./master-data-routing.module";
import { MedicalConditionComponent } from "./medical-condition/medical-condition.component";
import { MedicineComponent } from "./medicine/medicine.component";
import { TreatmentComponent } from "./treatment/treatment.component";
import { TagInputModule } from "ngx-chips";

@NgModule({
  imports: [
    TagInputModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MasterDataRoutingModule,
    AgGridModule,
  ],
  declarations: [
    MedicalConditionComponent,
    MedicineComponent,
    TreatmentComponent,
  ],
})
export class MasterDataModule {}
