import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AgGridModule } from "ag-grid-angular";
import { StaffMemberComponent } from "./staff-member/staff-member.component";
import { StaffMembersRoutingModule } from "./staff-members-routing.module";
import { ViewStaffMemberComponent } from "./view-staff-member/view-staff-member.component";

@NgModule({
  declarations: [StaffMemberComponent, ViewStaffMemberComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StaffMembersRoutingModule,
    AgGridModule,
  ],
})
export class StaffMemberModule {}
