import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./twofactor-auth.component.html",
})
export class TwofactorAuthComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  is_twofa_enabled = false;
  qrcode: any;
  userData: any;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    var html = document.getElementsByTagName("html")[0];
    html.classList.add("auth-layout");
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("bg-default");
    this.form = this.formBuilder.group({
      code: ["", Validators.required],
    });

    this.userData = this.authService.getSession();

    if (this.userData) {
      this.is_twofa_enabled = this.userData.is_twofa_enabled;
      this.qrcode = this.userData.twofa_qr_url;
    }
  }
  get f() {
    return this.form.controls;
  }

  onVerify() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const secret = this.authService.getSecret();

    console.log(secret);
    const verify_data = {
      token: this.form.value.code,
      secret: secret,
    };
    console.log(verify_data);
    this.authService.verify(verify_data);

    // this.onReset();
  }
  onReset() {
    this.submitted = false;
    this.form.reset();
  }
}
