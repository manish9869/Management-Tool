import { environment } from "./../../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import * as moment from "moment";
const BACKEND_URL = environment.apiUrl + "/staff-members"; // Assuming the API endpoint for staff members

@Injectable({ providedIn: "root" })
export class StaffMemberService {
  private staffMembers: any = [];

  private StaffMembersUpdated = new Subject<{
    staffMembers: any;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  async getStaffMembers() {
    this.http
      .get(BACKEND_URL)
      .pipe(
        map((resData: any) => {
          return {
            staffMembers: resData.data.map((data) => {
              return {
                id: data._id,
                staff_member_id: data.staff_member_id,
                fullname: data.fullname,
                email: data.email,
                address: data.address,
                mobile: data.mobile,
                alt_mobile: data.alt_mobile,
                DOB: data.DOB ? moment(data.DOB).format("DD-MMM-YYYY") : "NA",
                position: data.position,
                specialization: data.specialization,
              };
            }),
          };
        })
      )
      .subscribe((data: any) => {
        this.staffMembers = data.staffMembers;
        this.StaffMembersUpdated.next({
          staffMembers: [...this.staffMembers],
        });
      });
  }

  getStaffMemberUpdateListener() {
    return this.StaffMembersUpdated.asObservable();
  }

  getStaffMember(id: string) {
    return this.http.get(BACKEND_URL + "/" + id);
  }

  addStaffMember(staffMemberObj) {
    const StaffMemberData = staffMemberObj;
    return this.http.post(BACKEND_URL, StaffMemberData);
  }

  updateStaffMember(staffMemberObj, id) {
    const StaffMemberData = staffMemberObj;
    return this.http.patch(BACKEND_URL + "/" + id, StaffMemberData);
  }

  deleteStaffMember(staffMemberId: string) {
    return this.http.delete(BACKEND_URL + "/" + staffMemberId);
  }
}
