import { Component, OnInit, OnDestroy } from "@angular/core";
import { CustomerService } from "./../customer.service";
import { formatDate } from "@angular/common";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
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

  private customerSub: Subscription;

  constructor(public customerService: CustomerService) {}

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

    this.customerService.getCustomers();

    this.customerSub = this.customerService
      .getCustomerUpdateListener()
      .subscribe((customerData: any) => {
        this.isLoading = false;
        console.log(customerData);
        this.customerList = customerData.customers;
      });
  }

  onCreateCustomer() {
    console.log(this.form.invalid);

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

      this.customerService.addCustomer(customer_data);
    } else {
      const customer_data = {
        fullname: this.form.value.fullname,
        email: this.form.value.email,
        address: this.form.value.address,
        DOB: this.form.value.DOB,
      };
    }
    this.form.reset();
  }

  onDelete(customer_id: string) {
    this.isLoading = true;
    this.customerService.deleteCustomer(customer_id).subscribe(
      () => {
        this.customerService.getCustomers();
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onEdit(customer_id: string) {
    this.mode = "edit";
    this.isLoading = true;
    this.customerService.getCustomer(customer_id).subscribe((data: any) => {
      console.log(data);

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
