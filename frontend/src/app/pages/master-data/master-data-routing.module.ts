import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MedicalConditionComponent } from "./medical-condition/medical-condition.component";
import { MedicineComponent } from "./medicine/medicine.component";
import { TreatmentComponent } from "./treatment/treatment.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Master Data",
    },
    children: [
      {
        path: "",
        redirectTo: "medical-condition",
      },
      {
        path: "medical-condition",
        component: MedicalConditionComponent,
        data: {
          title: "Manage Medical Condition",
        },
      },
      {
        path: "medicine",
        component: MedicineComponent,
        data: {
          title: "Manage Medicine",
        },
      },
      {
        path: "treatment",
        component: TreatmentComponent,
        data: {
          title: "Manage Treatment",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterDataRoutingModule {}
