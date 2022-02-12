import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { AuthService } from "../auth.service";
@Component({
  selector: "app-dashboard",
  templateUrl: "login.component.html",
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ["", Validators.required],
      password: [null, [Validators.required]],
    });
  }
  get f() {
    return this.form.controls;
  }

  onLogin() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const user_data = {
      username: this.form.value.username,
      password: this.form.value.password,
    };

    this.authService.login(user_data);

    this.onReset();
  }
  onReset() {
    this.submitted = false;
    this.form.reset();
  }
}
