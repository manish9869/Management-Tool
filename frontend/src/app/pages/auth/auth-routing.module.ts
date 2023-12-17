import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { TwofactorAuthComponent } from "./twofactor-auth/twofactor-auth.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Customer",
    },
    children: [
      {
        path: "",
        redirectTo: "login",
      },
      {
        path: "login",
        component: LoginComponent,
        data: {
          title: "Login",
        },
      },
      {
        path: "register",
        component: RegisterComponent,
        data: {
          title: "Register",
        },
      },
      {
        path: "2fa",
        component: TwofactorAuthComponent,
        data: {
          title: "TwofactorAuth",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
