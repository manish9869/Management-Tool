import { Component, OnInit } from "@angular/core";
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

@Component({
  selector: "app-customer-appointment",
  templateUrl: "./customer-appointment.component.html",
  styleUrls: ["./customer-appointment.component.scss"],
})
export class CustomerAppointmentComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  CustomerAppointmentId;
  appointmentList: any = [];
  customerList: any[] = [];
  staffMemberList: any[] = [];
  public mode = "create";
  public customerAppointmentSub: Subscription;
  submitted = false;
  public tooltipShowDelay = 0;
  public defaultColDef;
  public frameworkComponents;
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean = [10, 20, 50, 100];

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
    { id: "scheduled", name: "Scheduled" },
    { id: "pending", name: "Pending" },
    { id: "complete", name: "Complete" },
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
      customer_id: new FormControl(null, {
        validators: [Validators.required],
      }),
      staff_member_id: new FormControl(null, {
        validators: [Validators.required],
      }),
      appointment_date: new FormControl(null, {
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
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;

    const CustomerAppointmentData = {
      customer_id: this.form.value.customer_id,
      staff_member_id: this.form.value.staff_member_id,
      appointment_date: this.form.value.appointment_date,
      duration: this.form.value.duration,
      reason: this.form.value.reason,
      status: this.form.value.status,
    };

    this.customerAppointmentService
      .addCustomerAppointment(CustomerAppointmentData)
      .subscribe((responseData) => {
        this.toastr.success("", Messages.SAVED);
        this.loadAppointmentsList();
      });

    this.resetForm();
  }

  resetForm() {
    this.form.reset();
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
        this.onView(e.rowData.CustomerAppointmentId);
        break;
      case "edit":
        this.onEdit(e.rowData.CustomerAppointmentId);
        break;
      case "delete":
        this.deleteCustomerAppointment(e.rowData.CustomerAppointmentId);
        break;
    }
  }

  onView(CustomerAppointmentId: string) {
    this.router.navigate(["/case-history/view"], {
      queryParams: { CustomerAppointmentId: CustomerAppointmentId },
    });
  }

  onEdit(CustomerAppointmentId: string) {
    this.mode = "edit";
    this.isLoading = true;
    this.CustomerAppointmentId = CustomerAppointmentId;

    this.customerAppointmentService
      .getCustomerAppointment(CustomerAppointmentId)
      .subscribe(
        (data: any) => {
          this.isLoading = false;
          console.log("data", data.data);
          this.form.patchValue({
            customer_id: data.data.customer_id.customer_id,
            staff_member_id: data.data.staff_member_id.staff_member_id,
            appointment_date: formatDate(
              data.data.appointment_date.trim(),
              "yyyy-MM-dd",
              "en"
            ),
            duration: data.data.duration,
            reason: data.data.reason,
            status: data.data.status,
          });
        },
        (error) => {
          this.isLoading = false;
          console.error("Error fetching case history:", error);
        }
      );
  }

  ngOnDestroy() {
    this.customerAppointmentSub.unsubscribe();
  }
}
