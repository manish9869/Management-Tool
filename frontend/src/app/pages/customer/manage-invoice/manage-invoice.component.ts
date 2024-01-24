import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { CustomerService } from "../customer.service";
import { CaseHistoryService } from "../case-history.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import Messages from "src/app/comman/constants";
import { ManageInvoiceService } from "../manage-invoice.service";
import { ButtonRendererComponent } from "../../helpers/button.renderer.component";
import {
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
} from "ag-grid-community";
import { FlatpickrOptions } from "ng2-flatpickr";

@Component({
  selector: "app-manage-invoice",
  templateUrl: "./manage-invoice.component.html",
  styleUrls: ["./manage-invoice.component.scss"],
})
export class ManageInvoiceComponent implements OnInit {
  @ViewChild("invoiceDateControl") invoiceDateControl: ElementRef;
  form: FormGroup;
  isLoading = false;
  submitted = false;
  invoiceDate;
  invoiceId;
  invoiceList: any[] = [];
  customerList: any[] = [];
  caseHistoryList: any = [];
  public mode = "create";
  public caseHistorySub: Subscription;
  public customerSub: Subscription;
  public tooltipShowDelay = 0;
  public defaultColDef;
  public frameworkComponents;
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean = [10, 20, 50, 100];
  public autoSizeStrategy:
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy = {
    type: "fitCellContents",
  };
  colDefs = [
    {
      headerName: "Customer Name",
      field: "customer_name",
    },

    {
      headerName: "Date",
      field: "inoice_date",
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
  exampleOptions: FlatpickrOptions = {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    maxDate: "today",
  };
  constructor(
    public caseHistoryService: CaseHistoryService,
    public customerService: CustomerService,
    public manageInvoiceService: ManageInvoiceService,
    private toastr: ToastrService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      customerId: new FormControl(null),
      caseHistoryId: new FormControl(null),
      invoice_date: new FormControl(null),
    });
    this.loadInvoiceList();
    this.loadCaseHistorysList();
    this.loadCustomerList();
  }

  get f() {
    return this.form.controls;
  }

  loadInvoiceList() {
    this.isLoading = true;
    this.manageInvoiceService.getInvoiceList();
    this.manageInvoiceService
      .getInvoiceUpdateListener()
      .subscribe((invoices: any) => {
        this.isLoading = false;
        this.invoiceList = invoices;
      });
  }

  loadCustomerList() {
    this.isLoading = true;
    this.customerService.getCustomers();
    this.customerSub = this.customerService
      .getCustomerUpdateListener()
      .subscribe((customerData: any) => {
        this.isLoading = false;
        this.customerList = customerData.customers;
      });
  }

  loadCaseHistorysList() {
    this.isLoading = true;
    this.caseHistorySub = this.caseHistoryService
      .getCaseHistoryList()
      .subscribe((caseData: any) => {
        this.isLoading = false;
        this.caseHistoryList = caseData.caseHistory;
      });
  }

  createInvoice() {
    try {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }
      this.submitted = true;
      this.isLoading = true;

      if (this.mode === "create") {
        const invoiceData = {
          customer_id: this.form.value.customerId,
          case_id: this.form.value.caseHistoryId,
          invoice_date: this.form.value.invoiceDate[0],
        };
        this.caseHistorySub = this.manageInvoiceService
          .addInvoice(invoiceData)
          .subscribe({
            next: (response) => {
              // Handle successful response
            },
            error: (error) => {
              this.toastr.error("", error.error.message);
              // Handle error, possibly display an error message
            },
            complete: () => {
              this.toastr.info("", Messages.SAVED);
              this.loadCaseHistorysList();
              // Handle complete if needed
            },
          });
      } else {
        const invoiceData = {
          customer_id: this.form.value.customerId,
          case_id: this.form.value.caseHistoryId,
          invoice_date: this.form.value.invoiceDate[0],
        };

        this.caseHistorySub = this.manageInvoiceService
          .updateInvoice(invoiceData, this.invoiceId)
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
              this.loadCaseHistorysList();
              // Handle complete if needed
            },
          });
      }

      this.resetForm();
    } catch (error) {
      // Handle error, possibly display an error message
    }
  }

  deleteInvoice(invoiceId) {
    this.isLoading = true;
    this.manageInvoiceService.deleteInvoice(invoiceId).subscribe(() => {
      this.toastr.warning("", "Invoice Deleted");
      this.loadCaseHistorysList();
    });
  }

  onClick(e) {
    switch (e.type) {
      case "select":
        this.onView(e.rowData.case_id);
        break;
      case "edit":
        this.onEdit(e.rowData.case_id);
        break;
      case "delete":
        this.deleteInvoice(e.rowData.case_id);
        break;
    }
  }

  onEdit(invoiceId: string) {
    this.mode = "edit";
    this.isLoading = true;
    this.invoiceId = invoiceId;

    this.manageInvoiceService
      .getInvoiceById(invoiceId)
      .subscribe((data: any) => {
        this.isLoading = false;
        console.log("data", data);
        this.form.patchValue({
          customerId: data.customer_id,
          caseHistoryId: data.staff_member_id,
        });
        this.invoiceDate = new Date(data.invoice_date);
      });
  }

  onView(invoice_id: string) {
    this.invoiceId = invoice_id;

    this.router.navigate(["/customer/view-case-history"], {
      queryParams: { invoiceId: invoice_id },
    });
  }

  resetForm() {
    this.mode = "create";
    this.invoiceDateControl["setDate"] = null;

    this.invoiceDate = null;
    this.form.clearValidators();
    this.form.updateValueAndValidity();
    this.form.reset();
    Object.keys(this.form.controls).forEach((field) => {
      this.form.controls[field].setErrors(null);
    });
    this.submitted = false;
  }

  ngOnDestroy() {
    if (this.caseHistorySub) this.caseHistorySub.unsubscribe();
    if (this.customerSub) this.customerSub.unsubscribe();
  }
}
