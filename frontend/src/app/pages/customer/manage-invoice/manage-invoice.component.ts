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
import {
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
} from "ag-grid-community";
import { FlatpickrOptions } from "ng2-flatpickr";
import { InvoiceDownloadRendererComponent } from "../../helpers/invoice-download.renderer.component";

@Component({
  selector: "app-manage-invoice",
  templateUrl: "./manage-invoice.component.html",
  styleUrls: ["./manage-invoice.component.scss"],
})
export class ManageInvoiceComponent implements OnInit {
  @ViewChild("invoiceDateControl") invoiceDateControl: ElementRef;
  @ViewChild("dueDateControl") dueDateControl: ElementRef;
  form: FormGroup;
  isLoading = false;
  submitted = false;
  isDisable = true;
  isPaymentStatusSelected: boolean = false;
  treatmentData;
  medicineData;
  conditionData;
  invoiceDate;
  dueDate;
  invoiceId;
  isDiscountApplied: boolean = false;
  invoiceTax: number = 13.0;
  invoiceTotal: number = 0.0;
  calculatedTax: number = 0.0;
  invoiceSubTotal: number = 0.0;
  discountTotal: number = 0.0;
  pendingTotalAmount: number = 0.0;
  totalPaidAmount: number = 0.0;
  finalBalanceAmount: number = 0.0;
  paidAmount: number = 0.0;
  invoiceList: any[] = [];
  customerList: any[] = [];
  caseHistoryList: any = [];
  pastPayments;
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
      headerName: "Invoice Number",
      field: "invoiceNumber",
      maxWidth: 180,
      wrapText: true,
      autoHeight: true,
    },
    {
      headerName: "Total Amount",
      field: "totalAmount",
    },
    {
      headerName: "Issue Date",
      field: "issueDate",
    },
    {
      headerName: "Status",
      field: "status",
    },
    {
      field: "Actions",
      cellRenderer: InvoiceDownloadRendererComponent,
      editable: false,
      sortable: false,
      resizable: false,
      cellRendererParams: {
        onClick: this.onClick.bind(this),
      },
    },
  ];

  inoviceDateOptions: FlatpickrOptions = {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    maxDate: "today",
  };

  dueDateOptions: FlatpickrOptions = {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    minDate: "today",
  };

  paymentOptions: any[] = [
    { id: "Credit Card", name: "Credit Card" },
    { id: "Debit Card", name: "Debit Card" },
    { id: "Bank Transfer", name: "Bank Transfer" },
    { id: "Cash", name: "Cash" },
    { id: "Other", name: "Other" },
  ];

  statusOptions: any[] = [
    { id: "Paid", name: "Paid" },
    { id: "Unpaid", name: "Unpaid" },
    { id: "Partial", name: "Partial Payment" },
  ];

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
      issueDate: new FormControl(null),
      discount: new FormControl({}),
      paymentMode: new FormControl(null),
      status: new FormControl(null),
      amountPaid: new FormControl(null),
      dueDate: new FormControl(null),
    });
    this.loadInvoiceList();
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
      .subscribe((data: any) => {
        this.isLoading = false;
        this.invoiceList = data.invoices;
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

  loadCaseHistorysList(customerId?: any) {
    console.log("customerId", customerId);

    this.isLoading = true;
    if (customerId) {
      this.caseHistorySub = this.caseHistoryService
        .getCaseHistoryName(customerId.id)
        .subscribe((caseData: any) => {
          this.isDisable = false;
          this.isLoading = false;
          this.caseHistoryList = caseData.caseHistory;
        });
    } else {
      this.isDisable = true;
    }
  }

  loadCaseHistory(caseId) {
    console.log("caseId", caseId);
    this.loadPastInvoices(caseId.id);
    this.caseHistorySub = this.caseHistoryService
      .getCaseHistoryById(caseId.case_id)
      .subscribe((caseData: any) => {
        this.isLoading = false;

        console.log("caseData==================>", caseData);

        this.treatmentData = caseData.treatment_ids;
        this.medicineData = caseData.medicine_ids;
        this.conditionData = caseData.condition_ids;

        this.calculateInvoice(caseData.treatment_ids);

        console.log(
          "this.treatmentData==================>",
          this.treatmentData
        );
        console.log("this.medicineData==================>", this.medicineData);
        console.log(
          "this.conditionData==================>",
          this.conditionData
        );
      });
  }

  loadPastInvoices(caseId) {
    console.log("invoice caseId", caseId);
    this.isLoading = true;
    this.manageInvoiceService
      .getInvoicesByCase(caseId)
      .subscribe((data: any) => {
        this.pastPayments = data.invoices;

        data.invoices.map((invoice) => {
          this.totalPaidAmount += parseFloat(invoice.amountPaid);
          this.form.patchValue({
            discount: invoice.discount,
          });
          this.form.controls["discount"].disable();

          // invoice.pendingAmount;
          // invoice.totalAmount;
          // invoice.discount;
          // invoice.totalDiscountAmount;
          // invoice.tax;
          // invoice.totaltaxAmount;
        });
      });
  }

  calculateInvoice(treatments) {
    this.invoiceTotal = 0.0;
    this.calculatedTax = 0.0;
    this.invoiceSubTotal = 0.0;
    this.discountTotal = 0.0;
    treatments.map((treatment) => {
      this.invoiceSubTotal += parseFloat(treatment.cost.$numberDecimal);
    });
    const discountPercentage = this.form.get("discount").value || 0;
    if (discountPercentage > 0) {
      const discountAmount = (this.invoiceSubTotal * discountPercentage) / 100;
      this.discountTotal = discountAmount;
      this.invoiceTotal = parseFloat(
        (this.invoiceSubTotal - discountAmount).toFixed(2)
      );
    } else {
      this.invoiceTotal = parseFloat(this.invoiceSubTotal.toFixed(2));
    }
    const taxRate = this.invoiceTax;
    const taxAmount = parseFloat(
      ((this.invoiceTotal * taxRate) / 100).toFixed(2)
    );
    this.calculatedTax = taxAmount;

    this.invoiceTotal = parseFloat((this.invoiceTotal + taxAmount).toFixed(2));

    if (this.totalPaidAmount > 0) {
      this.finalBalanceAmount = parseFloat(
        (this.invoiceTotal - this.totalPaidAmount).toFixed(2)
      );
    } else {
      this.finalBalanceAmount = parseFloat(this.invoiceTotal.toFixed(2));
    }
    this.calculatePendingAmount();
  }

  applyDiscount(event: any) {
    this.calculateInvoice(this.treatmentData);
  }

  calculatePendingAmount() {
    this.pendingTotalAmount = 0.0;

    this.paidAmount = 0.0;

    this.paidAmount = this.form.get("amountPaid").value || 0;

    this.pendingTotalAmount = this.finalBalanceAmount - this.paidAmount;
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
          issueDate: this.form.value.issueDate[0],
          discount: this.form.value.discount,
          totalAmount: this.invoiceTotal,
          status: this.form.value.status.trim(),
          dueDate: this.form.value.dueDate[0],
          paymentMode: this.form.value.paymentMode.trim(),
          amountPaid: this.form.value.amountPaid,
          totaltaxAmount: this.calculatedTax,
          totalDiscountAmount: this.discountTotal,
          pendingAmount: this.pendingTotalAmount,
          taxt: this.invoiceTax,
        };

        console.log("invoiceData=======>", invoiceData);
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
              this.loadInvoiceList();
              // Handle complete if needed
            },
          });
      } else {
        const invoiceData = {
          customer_id: this.form.value.customerId,
          case_id: this.form.value.caseHistoryId,
          issueDate: this.form.value.issueDate[0],
          discount: this.form.value.discount,
          totalAmount: this.invoiceTotal,
          status: this.form.value.status.trim(),
          dueDate: this.form.value.dueDate[0],
          paymentMode: this.form.value.paymentMode.trim(),
          amountPaid: this.form.value.amountPaid,
          totaltaxAmount: this.calculatedTax,
          totalDiscountAmount: this.discountTotal,
          pendingAmount: this.pendingTotalAmount,
          taxt: this.invoiceTax,
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

  onSelectedPaymentStatus(paymentStatus) {
    if (paymentStatus === "Partial Payment") {
      this.isPaymentStatusSelected = true;
    } else {
      this.isPaymentStatusSelected = false;
    }

    console.log("isPaymentStatusSelected", this.isPaymentStatusSelected);
  }

  onClick(e) {
    switch (e.type) {
      case "download":
        this.onDownload(e.rowData.case_id);
        break;
      case "view":
        this.onView(e.rowData.case_id);
        break;
      case "edit":
        this.onEdit(e.rowData.case_id);
        break;
      case "delete":
        this.deleteInvoice(e.rowData.invoice_id);
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

  async onDownload(invoice_id: string) {
    this.invoiceId = invoice_id;
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
    this.invoiceTotal = 0.0;
    this.calculatedTax = 0.0;
    this.invoiceSubTotal = 0.0;
    this.discountTotal = 0.0;
    this.pendingTotalAmount = 0.0;
    this.paidAmount = 0.0;
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
