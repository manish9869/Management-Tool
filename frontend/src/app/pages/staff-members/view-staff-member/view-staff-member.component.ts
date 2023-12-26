import { formatDate } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { StaffMemberService } from "../staff-members.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Params } from "@angular/router";

@Component({
  selector: "app-view-staff-member",
  templateUrl: "./view-staff-member.component.html",
  styleUrls: ["./view-staff-member.component.scss"],
})
export class ViewStaffMemberComponent implements OnInit {
  constructor(
    public staffMemberService: StaffMemberService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  public fullname: string;
  public email: string;
  public mobile: string;
  public altMobile: string;
  public address: string;
  public DOB: string;
  public position: string;
  public specialization: string;
  public consultation_fee: string;
  public qualification: string;
  public staffMemberId: string;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.staffMemberId = params["staffMemberId"];
    });
    this.fillStaffDetail(this.staffMemberId);
  }

  fillStaffDetail(staffMemberId: any) {
    this.staffMemberService
      .getStaffMember(staffMemberId)
      .subscribe((data: any) => {
        console.log("data", data.data);
        this.fullname = data.data.fullname;
        this.email = data.data.email;
        this.mobile = data.data.mobile;
        this.altMobile = data.data.alt_mobile;
        this.address = data.data.address;
        this.DOB = formatDate(data.data.DOB.trim(), "yyyy-MM-dd", "en");
        this.position = data.data.position;
        this.specialization = data.data.specialization;
        this.consultation_fee = data.data.consultation_fee;
        this.qualification = data.data.qualification;
      });
  }
}
