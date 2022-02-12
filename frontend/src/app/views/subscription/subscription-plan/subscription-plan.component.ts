import { Component, OnInit, OnDestroy } from "@angular/core";
import { SubscriptionService } from "../Subscription.service";
import { formatDate } from "@angular/common";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";
import { CustomTooltip } from "../../helpers/custom-tooltip.component";
import { ButtonRendererComponent } from "../../helpers/button.renderer.component";
import Messages from "../../../comman/constants";


@Component({
  selector: 'app-subscription-plan',
  templateUrl: './subscription-plan.component.html',
  styleUrls: ['./subscription-plan.component.css']
})
export class SubscriptionPlanComponent implements OnInit, OnDestroy{

  form: FormGroup;
  isLoading = false;
  subscription_id;
  subscriptionList: any = [];
  private mode = "create";
  public modules: Module[] = AllCommunityModules;
  private subscriptionSub: Subscription;
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
    public customerService: SubscriptionService,
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
      SubscriptionPlanName: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),

      Price: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(5)],
      }),
      Validity: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(5)],
      }),
    });

    this.onLoadSubscriptionList();
  }
  get f() {
    return this.form.controls;
  }
  onLoadSubscriptionList() {
    this.customerService.getSubscriptions();
    this.subscriptionSub = this.customerService
      .getSubscriptioUpdateListener()
      .subscribe((customerData: any) => {
        this.isLoading = false;
        console.log(customerData);
        this.subscriptionList = customerData.subscriptions;
      });
  }

  onCreateCustomer() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      const Subscription_data = {
        SubscriptionPlanName: this.form.value.SubscriptionPlanName.trim(),
        Price: this.form.value.Price,
        Validity: this.form.value.Validity,
      };

      this.customerService
        .addCustomer(Subscription_data)
        .subscribe((responseData) => {
          this.toastr.success("", Messages.SAVED);
          this.onLoadSubscriptionList();
        });
    } else {
      const Subscription_data = {
        SubscriptionPlanName: this.form.value.SubscriptionPlanName.trim(),
        Price: this.form.value.Price.trim(),
        Validity: this.form.value.Validity.trim(),
      };

      this.customerService
        .updateSubscriptio(Subscription_data, this.subscription_id)
        .subscribe((responseData) => {
          this.toastr.info("", Messages.UPDATED);
          this.onLoadSubscriptionList();
        });
    }
    this.form.reset();
  }

  onDelete(subscription_id) {
    this.isLoading = true;
    this.customerService.deleteSubscriptio(subscription_id).subscribe(
      () => {
        this.toastr.warning("", Messages.DELETED);
        this.customerService.getSubscriptions();
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

  onEdit(subscription_id: string) {
    this.mode = "edit";
    this.isLoading = true;
    this.subscription_id = subscription_id;
    this.customerService.getSubscription(subscription_id).subscribe((data: any) => {
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
    this.subscriptionSub.unsubscribe();
  }
}
