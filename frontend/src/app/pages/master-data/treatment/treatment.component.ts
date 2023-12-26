import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ColDef, GridApi, GridReadyEvent } from "ag-grid-community"; // Column Definitions Interface
import { ToastrService } from "ngx-toastr";
import Messages from "src/app/comman/constants";
import { ButtonRendererComponent } from "../../helpers/button.renderer.component";
import { TreatmentService } from "../treatment.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-treatment",
  templateUrl: "./treatment.component.html",
  styleUrls: ["./treatment.component.scss"],
})
export class TreatmentComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  treatmentId;
  treatmentsList: any = [];
  public mode = "create";
  public treatmentSub;
  submitted = false;
  public defaultColDef;
  public frameworkComponents;
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean = [10, 20, 50, 100];
  private gridApi!: GridApi;

  colDefs: ColDef[] = [
    {
      headerName: "Name",
      field: "name",
      tooltipField: "name",
    },

    { headerName: "Cost", field: "cost" },
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
    public treatmentService: TreatmentService,
    private toastr: ToastrService,
    private router: Router
  ) {
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
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      description: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      cost: new FormControl(null, {
        validators: [Validators.required],
      }),
      duration: new FormControl(null, {
        validators: [Validators.required],
      }),
      type: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
    });

    this.onLoadTreatmentsList();
  }

  get f() {
    return this.form.controls;
  }

  onFilterTextBoxChanged() {
    this.gridApi.setGridOption(
      "quickFilterText",
      (document.getElementById("filter-text-box") as HTMLInputElement).value
    );
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.onLoadTreatmentsList();
  }

  onLoadTreatmentsList() {
    this.treatmentService.getTreatments();
    this.treatmentSub = this.treatmentService
      .getTreatmentUpdateListener()
      .subscribe((treatmentData: any) => {
        this.isLoading = false;
        this.treatmentsList = treatmentData.treatments;
      });
  }

  onCreateTreatment() {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      const treatmentData = {
        name: this.form.value.name.trim(),
        description: this.form.value.description.trim(),
        cost: this.form.value.cost,
        duration: this.form.value.duration,
        type: this.form.value.type.trim(),
      };

      this.treatmentService
        .addTreatment(treatmentData)
        .subscribe((responseData) => {
          this.toastr.success("", Messages.SAVED);
          this.onLoadTreatmentsList();
        });
    } else {
      const treatmentData = {
        name: this.form.value.name.trim(),
        description: this.form.value.description.trim(),
        cost: this.form.value.cost,
        duration: this.form.value.duration,
        type: this.form.value.type.trim(),
      };

      this.treatmentService
        .updateTreatment(treatmentData, this.treatmentId)
        .subscribe((responseData) => {
          this.toastr.info("", Messages.UPDATED);
          this.onLoadTreatmentsList();
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

  onDelete(treatmentId) {
    this.isLoading = true;
    this.treatmentService.deleteTreatment(treatmentId).subscribe(
      () => {
        this.toastr.warning("", Messages.DELETED);
        this.treatmentService.getTreatments();
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onClick(e) {
    switch (e.type) {
      case "select":
        this.onView(e.rowData.treatment_id);
        break;
      case "edit":
        this.onEdit(e.rowData.treatment_id);
        break;
      case "delete":
        this.onDelete(e.rowData.treatment_id);
        break;
    }
  }
  onView(treatment_id: string) {
    // Implement view treatment functionality
    this.treatmentId = treatment_id;

    this.router.navigate(["/treatment/view-treatment"], {
      queryParams: { treatment_id: treatment_id },
    });
  }

  onEdit(treatmentId: string) {
    this.mode = "edit";
    this.isLoading = true;
    this.treatmentId = treatmentId;

    this.treatmentService.getTreatment(treatmentId).subscribe((data: any) => {
      this.isLoading = false;
      this.form.setValue({
        name: data.data.name,
        description: data.data.description,
        cost: data.data.cost,
        duration: data.data.duration,
        type: data.data.type,
      });
    });
  }
  ngOnDestroy() {
    this.treatmentSub.unsubscribe();
  }
}
