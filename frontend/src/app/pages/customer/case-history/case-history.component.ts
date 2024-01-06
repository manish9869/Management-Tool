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
import Messages from "src/app/comman/constants";
import { FlatpickrOptions } from "ng2-flatpickr";
import { CaseHistoryService } from "../case-history.service";
import { MedicalConditionService } from "../../master-data/medical-condition.service";
import { TreatmentService } from "../../master-data/treatment.service";
import { MedicineService } from "../../master-data/medicine.service";
import { Editor, Toolbar } from "ngx-editor";
import { FilePicker } from "../../helpers/file-picker.adapter";
import { HttpClient } from "@angular/common/http";
import { ValidationError } from "ngx-awesome-uploader";

@Component({
  selector: "app-case-history",
  templateUrl: "./case-history.component.html",
  styleUrls: ["./case-history.component.scss"],
})
export class CaseHistoryComponent implements OnInit {
  @ViewChild("caseDateControl") caseDateControl: ElementRef;

  adapter = new FilePicker(this.http);
  form: FormGroup;
  isLoading = false;
  caseHistoryId;
  caseHistoryList: any = [];
  customerList: any[] = [];
  conditionList: any = [];
  medicineList: any = [];
  treatmentList: any = [];
  staffMemberList: any[] = [];
  caseDate;
  public mode = "create";
  public caseHistorySub: Subscription;
  public conditionSub: Subscription;
  public treatmentSub: Subscription;
  public medicineSub: Subscription;
  submitted = false;
  public tooltipShowDelay = 0;
  public defaultColDef;
  public frameworkComponents;
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean = [10, 20, 50, 100];

  dentalHistory: Editor;
  medicalHistory: Editor;
  html = "";

  toolbar: Toolbar = [
    ["bold", "italic"],
    ["underline", "strike"],
    ["ordered_list", "bullet_list"],
    ["align_left", "align_center", "align_right", "align_justify"],
    ["code", "blockquote"],
    [{ heading: ["h1", "h2", "h3", "h4", "h5", "h6"] }],
    ["text_color", "background_color"],
    ["link", "image"],
  ];

  exampleOptions: FlatpickrOptions = {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    minDate: "today",
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
      field: "case_date",
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
    public caseHistoryService: CaseHistoryService,
    public customerService: CustomerService,
    public staffMemberService: StaffMemberService,
    public conditionService: MedicalConditionService,
    public treatmentService: TreatmentService,
    public medicineService: MedicineService,
    private toastr: ToastrService,
    private config: NgSelectConfig,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      customerId: new FormControl(null, {
        validators: [Validators.required],
      }),
      staffMemberId: new FormControl(null, {
        validators: [Validators.required],
      }),
      case_date: new FormControl(null, {
        validators: [Validators.required],
      }),
      notes: new FormControl(null, {
        validators: [Validators.required],
      }),
      condition_ids: new FormControl(null),
      treatment_ids: new FormControl(null),
      medicine_ids: new FormControl(null),
      dental_history: new FormControl(null),
      medical_history: new FormControl(null),
      case_documents: new FormControl(null),
    });

    this.loadCaseHistorysList();
    this.loadCustomerList();
    this.loadStaffMemberList();

    this.loadConditionList();
    this.loadMedicineList();
    this.loadTreatmentsList();

    this.medicalHistory = new Editor();
    this.dentalHistory = new Editor();
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

  loadConditionList() {
    this.conditionService.getMedicalConditions();
    this.conditionSub = this.conditionService
      .getMedicalConditionUpdateListener()
      .subscribe((conditionData: any) => {
        this.isLoading = false;
        this.conditionList = conditionData.medicalConditions;
      });
  }

  loadMedicineList() {
    this.medicineService.getMedicines();
    this.medicineSub = this.medicineService
      .getMedicineUpdateListener()
      .subscribe((medicineData: any) => {
        this.isLoading = false;
        this.medicineList = medicineData.medicines;
      });
  }

  loadTreatmentsList() {
    this.treatmentService.getTreatments();
    this.treatmentSub = this.treatmentService
      .getTreatmentUpdateListener()
      .subscribe((treatmentData: any) => {
        this.isLoading = false;
        this.treatmentList = treatmentData.treatments;
      });
  }

  loadCaseHistorysList() {
    this.isLoading = true;
    this.caseHistorySub = this.caseHistoryService
      .getCaseHistoryList()
      .subscribe((caseData: any) => {
        this.isLoading = false;
        console.log("caseData", caseData);
        this.caseHistoryList = caseData.caseHistory;
      });
  }

  createCaseHistory() {
    try {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }
      this.submitted = true;
      this.isLoading = true;

      if (this.mode === "create") {
        const caseHistoryData = {
          customer_id: this.form.value.customer_id,
          staff_member_id: this.form.value.staff_member_id,
          case_date: this.form.value.case_date,
          notes: this.form.value.notes,
          condition_ids: this.form.value.condition_ids,
          treatment_ids: this.form.value.treatment_ids,
          medicine_ids: this.form.value.medicine_ids,
          dental_history: this.form.value.dental_history,
          medical_history: this.form.value.medical_history,
          case_documents: this.form.value.case_documents,
        };
        this.caseHistorySub = this.caseHistoryService
          .addCaseHistory(caseHistoryData)
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
        const caseHistoryData = {
          customer_id: this.form.value.customer_id,
          staff_member_id: this.form.value.staff_member_id,
          case_date: this.form.value.case_date,
          notes: this.form.value.notes,
          condition_ids: this.form.value.condition_ids,
          treatment_ids: this.form.value.treatment_ids,
          medicine_ids: this.form.value.medicine_ids,
          dental_history: this.form.value.dental_history,
          medical_history: this.form.value.medical_history,
          case_documents: this.form.value.case_documents,
        };

        this.caseHistorySub = this.caseHistoryService
          .updateCaseHistory(caseHistoryData, this.caseHistoryId)
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

  public uploadSuccess(event): void {
    console.log(event);
  }

  public onValidationError(error: ValidationError): void {
    alert(`Validation Error ${error.error} in ${error.file?.name}`);
  }

  resetForm() {
    this.mode = "create";
    this.caseDateControl["setDate"] = null;
    this.form.value.appointmentDate = null;
    this.caseDate = null;
    this.form.clearValidators();
    this.form.updateValueAndValidity();
    this.form.reset();
    Object.keys(this.form.controls).forEach((field) => {
      this.form.controls[field].setErrors(null);
    });
    this.submitted = false;
  }

  deleteCaseHistory(caseHistoryId) {
    this.isLoading = true;
    this.caseHistoryService.deleteCaseHistory(caseHistoryId).subscribe(() => {
      this.toastr.warning("", "Case History Deleted");
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
        this.deleteCaseHistory(e.rowData.case_id);
        break;
    }
  }

  onView(case_id: string) {
    // ... (existing logic)
  }

  onEdit(caseHistoryId: string) {
    this.mode = "edit";
    this.isLoading = true;
    this.caseHistoryId = caseHistoryId;

    this.caseHistoryService
      .getCaseHistoryById(caseHistoryId)
      .subscribe((data: any) => {
        this.isLoading = false;

        this.form.patchValue({
          customer_id: this.form.value.customerId,
          staff_member_id: this.form.value.staffMemberId,
          case_date: this.form.value.caseDate,
          notes: this.form.value.notes,
          condition_ids: this.form.value.conditionIds,
          treatment_ids: this.form.value.treatmentIds,
          medicine_ids: this.form.value.medicineIds,
          dental_history: this.form.value.dental_history,
          medical_history: this.form.value.medical_history,
          case_documents: this.form.value.case_documents,
        });

        this.caseDate = new Date(data.data.case_date);
      });
  }

  ngOnDestroy() {
    if (this.caseHistorySub) this.caseHistorySub.unsubscribe();

    this.medicalHistory.destroy();
    this.dentalHistory.destroy();
  }
}
