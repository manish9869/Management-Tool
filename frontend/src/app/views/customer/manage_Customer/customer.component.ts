import { Component, OnInit, OnDestroy } from "@angular/core";
import { CustomerService } from "../customer.service";
import { formatDate } from "@angular/common";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import { CustomTooltip } from "../../helpers/custom-tooltip.component";
import { ButtonRendererComponent } from "../../helpers/button.renderer.component";
import Messages from "../../../comman/constants";

@Component({
  selector: "app-user",
  templateUrl: "./customer.component.html",
  styleUrls: ["./customer.component.css"],
})
export class CustomerComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isLoading = false;
  customer_id;
  customerList: any = [];
  private mode = "create";
  public modules: Module[] = AllCommunityModules;
  private customerSub: Subscription;
  submitted = false;
  private tooltipShowDelay;
  private defaultColDef;
  private frameworkComponents;
  private paginationPageSize;
  columnDefs = [
    {
      field: "fullname",
      tooltipField: "fullname",
      tooltipComponentParams: { color: "#ececec" },
    },
    { field: "email" },
    { field: "DOB" },
    {
      field: "Actions",
      cellRenderer: "buttonRenderer",
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
    this.tooltipShowDelay = 0;
    this.paginationPageSize = 10;
    this.frameworkComponents = {
      customTooltip: CustomTooltip,
      buttonRenderer: ButtonRendererComponent,
    };
  }

  ngOnInit() {
    this.form = new FormGroup({
      fullname: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),

      email: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
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
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      const customer_data = {
        fullname: this.form.value.fullname,
        email: this.form.value.email,
        address: this.form.value.address,
        DOB: this.form.value.DOB,
      };

      this.customerService
        .addCustomer(customer_data)
        .subscribe((responseData) => {
          this.toastr.success("", Messages.SAVED);
          this.onLoadCustomerList();
        });
    } else {
      const customer_data = {
        fullname: this.form.value.fullname,
        email: this.form.value.email,
        address: this.form.value.address,
        DOB: this.form.value.DOB,
      };

      this.customerService
        .updateCustomer(customer_data, this.customer_id)
        .subscribe((responseData) => {
          this.toastr.info("", Messages.UPDATED);
          this.onLoadCustomerList();
        });
    }
    this.form.reset();
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

      this.form.setValue({
        fullname: data.data.fullname,
        email: data.data.email,
        address: data.data.address,
        DOB: formatDate(data.data.DOB, "yyyy-MM-dd", "en"),
      });
    });
  }

  ngOnDestroy() {
    this.customerSub.unsubscribe();
  }
}
