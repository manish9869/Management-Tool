import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";

import { ButtonRendererComponent } from "../../helpers/button.renderer.component";
import { mobileNumberValidator } from "src/app/comman/validator";
import { MedicalConditionService } from "../medical-condition.service";
import { Router } from "@angular/router";
import { TagModel } from "ngx-chips/core/tag-model";

@Component({
  selector: "app-medical-condition",
  templateUrl: "./medical-condition.component.html",
  styleUrls: ["./medical-condition.component.scss"],
})
export class MedicalConditionComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isLoading = false;
  conditionId;
  conditionsList: any = [];
  symptoms: any = [];
  public mode = "create";
  public conditionSub: Subscription;
  submitted = false;
  public tooltipShowDelay = 0;
  public defaultColDef;
  public frameworkComponents;
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean = [10, 20, 50, 100];

  colDefs = [
    {
      headerName: "Name",
      field: "name",
    },

    { headerName: "Type", field: "type" },
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
    public conditionService: MedicalConditionService,
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

      type: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      symptoms: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
    this.symptoms = [];
    this.onLoadConditionsList();
  }
  public validators = [this.validateText];
  private validateText(control: FormControl) {
    const value: string = control.value;

    // Check if the text contains numbers or special characters
    const containsNumberOrSpecialChar =
      /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
    if (containsNumberOrSpecialChar) {
      return {
        containsNumberOrSpecialChar: true, // Indicates it contains a number or special character
      };
    }

    return null; // Passes validation if no issues are found
  }

  public errorMessages = {
    containsNumberOrSpecialChar: "Symptpm does not containe number",
  };

  get f() {
    return this.form.controls;
  }

  onLoadConditionsList() {
    this.conditionService.getMedicalConditions();
    this.conditionSub = this.conditionService
      .getMedicalConditionUpdateListener()
      .subscribe((conditionData: any) => {
        this.isLoading = false;
        this.conditionsList = conditionData.medicalConditions;
      });
  }

  onCreateCondition() {
    console.log("this.form.value.symptoms", this.form.value.symptoms);
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      const conditionData = {
        name: this.form.value.name.trim(),
        description: this.form.value.description.trim(),
        symptoms: this.symptoms,
        type: this.form.value.type.trim(),
      };
      console.log("conditionData", conditionData);
      this.conditionService
        .addMedicalCondition(conditionData)
        .subscribe((responseData) => {
          this.toastr.success("", "Saved");
          this.onLoadConditionsList();
        });
    } else {
      const conditionData = {
        name: this.form.value.name.trim(),
        description: this.form.value.description.trim(),
        symptoms: this.symptoms,
        type: this.form.value.type.trim(),
      };

      this.conditionService
        .updateMedicalCondition(conditionData, this.conditionId)
        .subscribe((responseData) => {
          this.toastr.info("", "Updated");
          this.onLoadConditionsList();
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

  onClick(e) {
    switch (e.type) {
      case "select":
        this.onView(e.rowData.condition_id);
        break;
      case "edit":
        this.onEdit(e.rowData.condition_id);
        break;
      case "delete":
        this.onDelete(e.rowData.condition_id);
        break;
    }
  }

  onView(conditionId: string) {
    this.conditionId = conditionId;

    this.router.navigate(["/condition/view-condition"], {
      queryParams: { conditionId: conditionId },
    });
  }

  onEdit(conditionId: string) {
    this.mode = "edit";
    this.isLoading = true;
    this.conditionId = conditionId;

    this.conditionService
      .getMedicalCondition(conditionId)
      .subscribe((data: any) => {
        this.isLoading = false;
        this.form.setValue({
          name: data.data.name,
          description: data.data.description,
          symptoms: data.data.symptoms,
          type: data.data.type,
        });
      });
  }

  onDelete(conditionId) {
    this.isLoading = true;
    this.conditionService.deleteMedicalCondition(conditionId).subscribe(
      () => {
        this.toastr.warning("", "Deleted");
        this.conditionService.getMedicalConditions();
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  addSymptoms(tagText: TagModel) {
    console.log("tagText", tagText);

    this.symptoms.push(tagText["value"]);
  }

  ngOnDestroy() {
    this.conditionSub.unsubscribe();
  }
}
