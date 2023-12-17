import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { MustMatch } from "../../helpers/must-match.validator";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-dashboard",
  templateUrl: "register.component.html",
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  private mode = "create";
  isLoading = false;
  submitted = false;
  public isCollapsed = true;
  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    var html = document.getElementsByTagName("html")[0];
    html.classList.add("auth-layout");
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("bg-default");
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
    this.form = this.formBuilder.group(
      {
        name: ["", Validators.required],
        username: ["", Validators.required],
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required, Validators.minLength(6)]],
        confirmPassword: [null, Validators.required],
        acceptTerms: [false, Validators.requiredTrue],
      },
      {
        validator: MustMatch("password", "confirmPassword"),
      }
    );
  }
  get f() {
    return this.form.controls;
  }

  onCreateUser() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      const user_data = {
        name: this.form.value.name,
        email: this.form.value.email,
        username: this.form.value.username,
        password: this.form.value.password,
        role_id: 1,
        profile_img: null,
      };

      this.authService.createUser(user_data);
    } else {
      const customer_data = {
        name: this.form.value.name,
        email: this.form.value.email,
        username: this.form.value.username,
        password: this.form.value.password,
        role_id: 1,
        profile_img: null,
      };
    }
    this.onReset();
  }

  onReset() {
    this.submitted = false;
    this.form.reset();
  }
}
