import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ColDef } from "ag-grid-community"; // Column Definitions Interface
import { Subscription } from "rxjs";
import { formatDate } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import Messages from "src/app/comman/constants";
import { CustomTooltip } from "../../helpers/custom-tooltip.component";
import { ButtonRendererComponent } from "../../helpers/button.renderer.component";
import { mobileNumberValidator } from "src/app/comman/validator";
import { StaffMemberService } from "../staff-members.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-staff-member",
  templateUrl: "./staff-member.component.html",
  styleUrls: ["./staff-member.component.scss"],
})
export class StaffMemberComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  staffMemberId;
  staffMembersList: any = [];
  public mode = "create";
  public staffMemberSub: Subscription;
  submitted = false;
  public tooltipShowDelay = 0;
  public defaultColDef;
  public frameworkComponents;
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean = [10, 20, 50, 100];

  colDefs: ColDef[] = [
    {
      headerName: "Full Name",
      field: "fullname",
      tooltipField: "fullname",
      tooltipComponent: CustomTooltip,
      tooltipComponentParams: { color: "#ececec" },
    },
    { headerName: "Mobile", field: "mobile" },
    { headerName: "Email", field: "email" },
    {
      field: "Actions",
      cellRenderer: ButtonRendererComponent,
      editable: false,
      sortable: false,
      resizable: false,
      cellRendererParams: {
        onClick: this.onClick.bind(this),
      },
    },
  ];

  constructor(
    public staffMemberService: StaffMemberService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.defaultColDef = {
      editable: true,
      sortable: true,
      flex: 1,
      filter: true,
      resizable: true,
      tooltipComponent: "customTooltip",
    };
  }

  ngOnInit() {
    this.form = new FormGroup({
      fullname: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),

      email: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.email,
        ],
      }),
      mobile: new FormControl(null, {
        validators: [Validators.required, mobileNumberValidator()],
      }),
      altMobile: new FormControl(null, {
        validators: [Validators.required, mobileNumberValidator()],
      }),
      DOB: new FormControl(null, {
        validators: [Validators.required],
      }),

      address: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),

      position: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),

      qualification: new FormControl(null, {
        validators: [Validators.required],
      }),

      consultation_fee: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),

      specialization: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
    });

    this.onLoadStaffMembersList();
  }

  get f() {
    return this.form.controls;
  }

  onLoadStaffMembersList() {
    this.staffMemberService.getStaffMembers();
    this.staffMemberSub = this.staffMemberService
      .getStaffMemberUpdateListener()
      .subscribe((staffMemberData: any) => {
        this.isLoading = false;
        this.staffMembersList = staffMemberData.staffMembers;
      });
  }

  onCreateStaffMember() {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      const staffMemberData = {
        fullname: this.form.value.fullname.trim(),
        email: this.form.value.email.trim(),
        mobile: this.form.value.mobile.trim(),
        alt_mobile: this.form.value.altMobile.trim(),
        address: this.form.value.address.trim(),
        DOB: this.form.value.DOB.trim(),
        position: this.form.value.position.trim(),
        specialization: this.form.value.specialization.trim(),
        consultation_fee: this.form.value.consultation_fee,
        qualification: this.form.value.qualification.trim(),
      };

      this.staffMemberService
        .addStaffMember(staffMemberData)
        .subscribe((responseData) => {
          this.toastr.success("", Messages.SAVED);
          this.onLoadStaffMembersList();
        });
    } else {
      const staffMemberData = {
        fullname: this.form.value.fullname.trim(),
        email: this.form.value.email.trim(),
        mobile: this.form.value.mobile.trim(),
        alt_mobile: this.form.value.altMobile.trim(),
        address: this.form.value.address.trim(),
        DOB: this.form.value.DOB.trim(),
        position: this.form.value.position.trim(),
        specialization: this.form.value.specialization.trim(),
        consultation_fee: this.form.value.consultation_fee,
        qualification: this.form.value.qualification.trim(),
      };

      this.staffMemberService
        .updateStaffMember(staffMemberData, this.staffMemberId)
        .subscribe((responseData) => {
          this.toastr.info("", Messages.UPDATED);
          this.onLoadStaffMembersList();
        });
    }

    this.resetForm();
  }

  resetForm() {
    this.form.clearValidators();
    this.form.updateValueAndValidity();
    this.form.reset();
    Object.keys(this.form.controls).forEach((field) => {
      this.form.controls[field].setErrors(null);
    });
  }

  onDelete(staffMemberId) {
    this.isLoading = true;
    this.staffMemberService.deleteStaffMember(staffMemberId).subscribe(
      () => {
        this.toastr.warning("", Messages.DELETED);
        this.staffMemberService.getStaffMembers();
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onClick(e) {
    switch (e.type) {
      case "select":
        this.onView(e.rowData.staff_member_id);
        break;
      case "edit":
        this.onEdit(e.rowData.staff_member_id);
        break;
      case "delete":
        this.onDelete(e.rowData.staff_member_id);
        break;
    }
  }

  onView(staffMemberId: string) {
    this.staffMemberId = staffMemberId;

    this.router.navigate(["/staff/view-staff-members"], {
      queryParams: { staffMemberId: staffMemberId },
    });
  }

  onEdit(staffMemberId: string) {
    this.mode = "edit";
    this.isLoading = true;
    this.staffMemberId = staffMemberId;

    this.staffMemberService
      .getStaffMember(staffMemberId)
      .subscribe((data: any) => {
        this.isLoading = false;
        console.log("data", data.data);
        this.form.setValue({
          fullname: data.data.fullname,
          email: data.data.email,
          mobile: data.data.mobile,
          altMobile: data.data.alt_mobile,
          address: data.data.address,
          DOB: formatDate(data.data.DOB.trim(), "yyyy-MM-dd", "en"),
          position: data.data.position,
          specialization: data.data.specialization,
          consultation_fee: data.data.consultation_fee,
          qualification: data.data.qualification,
        });
      });
  }

  ngOnDestroy() {
    this.staffMemberSub.unsubscribe();
  }
}
