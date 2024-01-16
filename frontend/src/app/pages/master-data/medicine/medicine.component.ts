import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ColDef } from "ag-grid-community"; // Column Definitions Interface
import { Subscription } from "rxjs";
import { MedicineService } from "../medicine.service";
import { ToastrService } from "ngx-toastr";
import { ButtonRendererComponent } from "../../helpers/button.renderer.component";
import Messages from "src/app/comman/constants";

@Component({
  selector: "app-medicine",
  templateUrl: "./medicine.component.html",
  styleUrls: ["./medicine.component.scss"],
})
export class MedicineComponent implements OnInit, OnDestroy {
  medicineForm: FormGroup;
  isLoading = false;
  medicine_id;
  medicineList: any = [];
  public mode = "create";
  public medicineSub: Subscription;
  submitted = false;
  public tooltipShowDelay = 0;
  public defaultColDef;
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean = [10, 20, 50, 100];

  colDefs: ColDef[] = [
    {
      headerName: "Medicine Name",
      field: "medicineName",
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

  constructor(
    public medicineService: MedicineService,
    private toastr: ToastrService
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
    this.medicineForm = new FormGroup({
      medicineName: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),

      description: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
    });

    this.onLoadMedicineList();
  }

  onLoadMedicineList() {
    this.medicineService.getMedicines();
    this.medicineSub = this.medicineService
      .getMedicineUpdateListener()
      .subscribe((medicineData: any) => {
        this.isLoading = false;
        this.medicineList = medicineData.medicines;
      });
  }

  get f() {
    return this.medicineForm.controls;
  }

  onCreateMedicine() {
    this.submitted = true;
    if (this.medicineForm.invalid) {
      this.medicineForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      const medicine_data = {
        name: this.medicineForm.value.medicineName.trim(),
        description: this.medicineForm.value.description.trim(),
      };

      this.medicineService
        .addMedicine(medicine_data)
        .subscribe((responseData) => {
          this.toastr.success("", Messages.SAVED);
          this.onLoadMedicineList();
        });
    } else {
      const medicine_data = {
        name: this.medicineForm.value.medicineName.trim(),
        description: this.medicineForm.value.description.trim(),
      };

      this.medicineService
        .updateMedicine(medicine_data, this.medicine_id)
        .subscribe((responseData) => {
          this.toastr.info("", Messages.UPDATED);
          this.onLoadMedicineList();
        });
    }

    this.resetMedicineForm();
  }

  resetMedicineForm() {
    this.submitted = false;

    this.medicineForm.reset(); // Resetting form values

    // Marking all controls as untouched
    Object.keys(this.medicineForm.controls).forEach((field) => {
      const control = this.medicineForm.get(field);
      control.markAsUntouched();
    });

    // Clearing validation errors
    Object.keys(this.medicineForm.controls).forEach((field) => {
      const control = this.medicineForm.get(field);
      control.setErrors(null);
    });
  }

  onDelete(medicine_id) {
    this.isLoading = true;
    this.medicineService.deleteMedicine(medicine_id).subscribe(
      () => {
        this.toastr.warning("", Messages.DELETED);
        this.medicineService.getMedicines();
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
        this.onEdit(e.rowData.medicine_id);
        break;
      case "delete":
        this.onDelete(e.rowData.medicine_id);
        break;
    }
  }

  onEdit(medicine_id: string) {
    this.mode = "edit";
    this.isLoading = true;
    this.medicine_id = medicine_id;

    this.medicineService.getMedicine(medicine_id).subscribe((data: any) => {
      this.isLoading = false;
      console.log("data", data.data);
      this.medicineForm.setValue({
        medicineName: data.data.name ? data.data.name.trim() : data.data.name,
        description: data.data.description
          ? data.data.description.trim()
          : data.data.description,
      });
    });
  }

  ngOnDestroy() {
    this.medicineSub.unsubscribe();
  }
}
