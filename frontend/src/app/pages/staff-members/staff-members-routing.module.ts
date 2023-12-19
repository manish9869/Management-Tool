import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { StaffMemberComponent } from "./staff-member/staff-member.component";
import { ViewStaffMemberComponent } from "./view-staff-member/view-staff-member.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Staff Members",
    },
    children: [
      {
        path: "",
        redirectTo: "staff-members",
      },
      {
        path: "manage-staff-members",
        component: StaffMemberComponent,
        data: {
          title: "Manage Staff Members",
        },
      },
      {
        path: "view-staff-members",
        component: ViewStaffMemberComponent,
        data: {
          title: "View Staff Members",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StaffMembersRoutingModule {}
