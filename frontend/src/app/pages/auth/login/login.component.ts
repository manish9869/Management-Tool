import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-dashboard",
  templateUrl: "login.component.html",
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  test: Date = new Date();
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
