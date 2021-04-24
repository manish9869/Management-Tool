import { Component, OnInit } from "@angular/core";
import { CustomerService } from "./../customer.service";

import { FormGroup, FormControl, Validators } from "@angular/forms";
@Component({
  selector: "app-user",
  templateUrl: "./customer.component.html",
  styleUrls: ["./customer.component.scss"],
})
export class CustomerComponent implements OnInit {
  form: FormGroup;
  constructor() {}

  ngOnInit() {
    this.form = new FormGroup({
      fullname: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),

      email: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),

      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),

      DOB: new FormControl(null, {
        validators: [Validators.required],
      }),

      address: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
    });
  }

  onCreateCustomer() {
    if (this.form.invalid) {
      return;
    }

    this.form.reset();
  }
}
