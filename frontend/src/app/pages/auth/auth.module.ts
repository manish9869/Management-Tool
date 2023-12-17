import { AuthRoutingModule } from "./auth-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { CommonModule } from "@angular/common";
import { TwofactorAuthComponent } from './twofactor-auth/twofactor-auth.component';
@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, AuthRoutingModule],
  declarations: [LoginComponent, RegisterComponent, TwofactorAuthComponent],
})
export class AuthModule {}
