import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { formatDate } from "@angular/common";
import { Subscription } from "rxjs";
import { ButtonRendererComponent } from "../../helpers/button.renderer.component";
import { Router } from "@angular/router";
import { NgSelectConfig } from "@ng-select/ng-select";
import { CustomerService } from "../customer.service";
import { StaffMemberService } from "../../staff-members/staff-members.service";
import { CustomerAppointmentService } from "../customer-appointment.service";
import Messages from "src/app/comman/constants";
import { FlatpickrOptions } from "ng2-flatpickr";
@Component({
  selector: "app-customer-appointment",
  templateUrl: "./customer-appointment.component.html",
  styleUrls: ["./customer-appointment.component.scss"],
})
export class CustomerAppointmentComponent implements OnInit {
  @ViewChild("appointmentDateControl") appointmentDateControl: ElementRef;

  form: FormGroup;
  isLoading = false;
  customerAppointmentId;
  appointmentList: any = [];
  customerList: any[] = [];
  staffMemberList: any[] = [];
  appointmentDate;
  public mode = "create";
  public customerAppointmentSub: Subscription;
  submitted = false;
  public tooltipShowDelay = 0;
  public defaultColDef;
  public frameworkComponents;
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean = [10, 20, 50, 100];

  exampleOptions: FlatpickrOptions = {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    minDate: "today",
    // onDayCreate: function (dObj, dStr, fp, dayElem) {
    //   // Utilize dayElem.dateObj, which is the corresponding Date

    //   // dummy logic
    //   if (Math.random() < 0.15)
    //     dayElem.innerHTML += "<span class='event'></span>";
    //   else if (Math.random() > 0.85)
    //     dayElem.innerHTML += "<span class='event busy'></span>";
    // },
  };

  colDefs = [
    {
      headerName: "Customer Name",
      field: "customer_name",
    },
    {
      headerName: "Staff Name",
      field: "staff_member_name",
    },

    {
      headerName: "Date",
      field: "appointment_date",
    },
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

  statusOptions: any[] = [
    { id: "Scheduled", name: "Scheduled" },
    { id: "Pending", name: "Pending" },
    { id: "Complete", name: "Complete" },
  ];

  constructor(
    public customerAppointmentService: CustomerAppointmentService,
    public customerService: CustomerService,
    public staffMemberService: StaffMemberService,
    private toastr: ToastrService,
    private config: NgSelectConfig,
    private router: Router
  ) {
    this.config.notFoundText = "User not found";
    this.config.appendTo = "body";
    // set the bindValue to global config when you use the same
    // bindValue in most of the place.
    // You can also override bindValue for the specified template
    // by defining `bindValue` as property
    // Eg : <ng-select bindValue="some-new-value"></ng-select>
    this.config.bindValue = "value";

    this.defaultColDef = {
      editable: true,
      sortable: true,
      flex: 1,
      filter: true,
      resizable: true,
    };
  }

  ngOnInit() {
    this.form = new FormGroup({
      customerId: new FormControl(null, {
        validators: [Validators.required],
      }),
      staffMemberId: new FormControl(null, {
        validators: [Validators.required],
      }),
      appointmentDate: new FormControl(null, {
        validators: [Validators.required],
      }),
      duration: new FormControl(null, {
        validators: [Validators.required],
      }),
      reason: new FormControl(null, {
        validators: [Validators.required],
      }),
      status: new FormControl(null, {
        validators: [Validators.required],
      }),
    });

    this.loadAppointmentsList();
    this.loadCustomerList();
    this.loadStaffMemberList();
  }

  get f() {
    return this.form.controls;
  }

  loadCustomerList() {
    this.isLoading = true;
    this.customerService.getCustomers();
    this.customerService
      .getCustomerUpdateListener()
      .subscribe((customerData: any) => {
        this.isLoading = false;
        this.customerList = customerData.customers;
        console.log("this.customerList", this.customerList);
      });
  }

  loadStaffMemberList() {
    this.isLoading = true;
    this.staffMemberService.getStaffMembers();
    this.staffMemberService
      .getStaffMemberUpdateListener()
      .subscribe((staffMemberData: any) => {
        this.isLoading = false;
        this.staffMemberList = staffMemberData.staffMembers;
      });
  }

  loadAppointmentsList() {
    this.isLoading = true;
    this.customerAppointmentSub = this.customerAppointmentService
      .getCustomerAppointments()
      .subscribe((appointmentsData: any) => {
        this.isLoading = false;
        this.appointmentList = appointmentsData.appointments;
      });
  }

  createCustomerAppointment() {
    try {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }
      this.submitted = true;
      this.isLoading = true;
      if (this.mode === "create") {
        const appointment_data = {
          customer_id: this.form.value.customerId,
          staff_member_id: this.form.value.staffMemberId,
          appointment_date: this.form.value.appointmentDate[0],
          duration: this.form.value.duration,
          reason: this.form.value.reason.trim(),
          status: this.form.value.status.trim(),
        };

        this.customerAppointmentService
          .addCustomerAppointment(appointment_data)
          .subscribe((responseData) => {
            this.toastr.success("", Messages.SAVED);
            this.loadAppointmentsList();
          });
      } else {
        const appointment_data = {
          customer_id: this.form.value.customerId,
          staff_member_id: this.form.value.staffMemberId,
          appointment_date: this.form.value.appointmentDate[0],
          duration: this.form.value.duration,
          reason: this.form.value.reason.trim(),
          status: this.form.value.status.trim(),
        };

        this.customerAppointmentSub = this.customerAppointmentService
          .updateCustomerAppointment(
            appointment_data,
            this.customerAppointmentId
          )
          .subscribe({
            next: (response) => {
              // Handle successful response
            },
            error: (error) => {
              this.toastr.error("", error.error.message);
              // Handle error, possibly display an error message
            },
            complete: () => {
              this.toastr.info("", Messages.UPDATED);
              this.loadAppointmentsList();
              // Handle complete if needed
            },
          });
      }

      this.resetForm();
    } catch (error) {
      this.toastr.error("", error);
    }
  }

  resetForm() {
    this.mode = "create";
    this.appointmentDateControl["setDate"] = null;
    this.form.value.appointmentDate = null;
    this.appointmentDate = null;
    this.form.clearValidators();
    this.form.updateValueAndValidity();
    this.form.reset();
    Object.keys(this.form.controls).forEach((field) => {
      this.form.controls[field].setErrors(null);
    });
    this.submitted = false;
  }

  deleteCustomerAppointment(CustomerAppointmentId) {
    this.isLoading = true;
    this.customerAppointmentService
      .deleteCustomerAppointment(CustomerAppointmentId)
      .subscribe(() => {
        this.toastr.warning("", "Case History Deleted");
        this.loadAppointmentsList();
      });
  }

  onClick(e) {
    switch (e.type) {
      case "select":
        this.onView(e.rowData.appointment_id);
        break;
      case "edit":
        this.onEdit(e.rowData.appointment_id);
        break;
      case "delete":
        this.deleteCustomerAppointment(e.rowData.appointment_id);
        break;
    }
  }

  onView(appointment_id: string) {
    this.router.navigate(["/case-history/view"], {
      queryParams: { appointment_id: appointment_id },
    });
  }

  onEdit(CustomerAppointmentId: string) {
    this.mode = "edit";
    this.isLoading = true;
    this.customerAppointmentId = CustomerAppointmentId;

    this.customerAppointmentService
      .getCustomerAppointment(CustomerAppointmentId)
      .subscribe((data: any) => {
        this.isLoading = false;

        this.form.patchValue({
          customerId: data.data.customer_id._id,
          staffMemberId: data.data.staff_member_id._id,
          duration: data.data.duration,
          reason: data.data.reason,
          status: data.data.status,
        });

        this.appointmentDate = new Date(data.data.appointment_date);
      });
  }

  ngOnDestroy() {
    if (this.customerAppointmentSub) this.customerAppointmentSub.unsubscribe();
  }
}
