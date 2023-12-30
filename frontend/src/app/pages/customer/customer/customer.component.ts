import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from "@angular/forms";
import { ColDef } from "ag-grid-community"; // Column Definitions Interface
import { Subscription } from "rxjs";
import { CustomerService } from "../customer.service";
import { formatDate } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import Messages from "src/app/comman/constants";
import { CustomTooltip } from "../../helpers/custom-tooltip.component";
import { ButtonRendererComponent } from "../../helpers/button.renderer.component";
import { mobileNumberValidator } from "src/app/comman/validator";

@Component({
  selector: "app-customer",
  templateUrl: "./customer.component.html",
  styleUrls: ["./customer.component.scss"],
})
export class CustomerComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  customer_id;
  customerList: any = [];
  public mode = "create";
  public customerSub: Subscription;
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
    public customerService: CustomerService,
    private toastr: ToastrService
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
    });

    this.onLoadCustomerList();
  }
  get f() {
    return this.form.controls;
  }

  onLoadCustomerList() {
    this.customerService.getCustomers();
    this.customerSub = this.customerService
      .getCustomerUpdateListener()
      .subscribe((customerData: any) => {
        this.isLoading = false;
        this.customerList = customerData.customers;
      });
  }

  onCreateCustomer() {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      const customer_data = {
        fullname: this.form.value.fullname.trim(),
        email: this.form.value.email.trim(),
        mobile: this.form.value.mobile.trim(),
        alt_mobile: this.form.value.altMobile.trim(),
        address: this.form.value.address.trim(),
        DOB: this.form.value.DOB.trim(),
      };

      this.customerService
        .addCustomer(customer_data)
        .subscribe((responseData) => {
          this.toastr.success("", Messages.SAVED);
          this.onLoadCustomerList();
        });
    } else {
      const customer_data = {
        fullname: this.form.value.fullname.trim(),
        email: this.form.value.email.trim(),
        mobile: this.form.value.mobile.trim(),
        alt_mobile: this.form.value.altMobile.trim(),
        address: this.form.value.address.trim(),
        DOB: this.form.value.DOB.trim(),
      };

      this.customerService
        .updateCustomer(customer_data, this.customer_id)
        .subscribe((responseData) => {
          this.toastr.info("", Messages.UPDATED);
          this.onLoadCustomerList();
        });
    }

    this.resetForm();
  }

  resetForm() {
    this.mode = "create";
    this.form.clearValidators();
    this.form.updateValueAndValidity();
    this.form.reset();
    Object.keys(this.form.controls).forEach((field) => {
      this.form.controls[field].setErrors(null);
    });
  }

  onDelete(customer_id) {
    this.isLoading = true;
    this.customerService.deleteCustomer(customer_id).subscribe(
      () => {
        this.toastr.warning("", Messages.DELETED);
        this.customerService.getCustomers();
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onClick(e) {
    switch (e.type) {
      case "select":
        break;
      case "edit":
        this.onEdit(e.rowData.customer_id);
        break;
      case "delete":
        this.onDelete(e.rowData.customer_id);
        break;
    }
  }

  onEdit(customer_id: string) {
    this.mode = "edit";
    this.isLoading = true;
    this.customer_id = customer_id;

    this.customerService.getCustomer(customer_id).subscribe((data: any) => {
      this.isLoading = false;
      console.log("data", data.data);
      this.form.setValue({
        fullname: data.data.fullname
          ? data.data.fullname.trim()
          : data.data.fullname,
        email: data.data.email ? data.data.email.trim() : data.data.email,
        mobile: data.data.mobile ? data.data.mobile.trim() : data.data.mobile,
        altMobile: data.data.alt_mobile
          ? data.data.alt_mobile.trim()
          : data.data.alt_mobile,
        address: data.data.address
          ? data.data.address.trim()
          : data.data.address,
        DOB: formatDate(data.data.DOB.trim(), "yyyy-MM-dd", "en"),
      });
    });
  }

  ngOnDestroy() {
    this.customerSub.unsubscribe();
  }
}
