import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { environment } from "./../../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/user";
const AUTH_BACKEND_URL = environment.apiUrl + "/auth";
@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private userdata: any;
  private token: string;
  private secret_key: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    if (this.userdata) this.token = this.userdata.token;
    return this.token;
  }

  getSession() {
    let res = this.getAuthData();
    let data = JSON.parse(res.userdata);

    this.userdata = data;
    return this.userdata;
  }

  getSecret() {
    let res = this.getAuthData();
    let data = JSON.parse(res.userdata);
    this.secret_key = data.secret_key;
    return this.secret_key;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    if (this.userdata) this.userId = this.userdata.user_id;

    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(usedDataObj) {
    const UserData = usedDataObj;

    this.http.post(BACKEND_URL, UserData).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        console.log(error);
        this.authStatusListener.next(false);
      }
    );
  }

  login(loginObj) {
    this.http.post(AUTH_BACKEND_URL + "/login", loginObj).subscribe(
      (response: any) => {
        const token = response.data.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.data.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.data.user_id;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );

          this.saveAuthData(response.data, expirationDate);
          this.router.navigate(["/auth/2fa"]);
        }
      },
      (error) => {
        this.authStatusListener.next(false);
      }
    );
  }

  verify(verifyobj) {
    this.http.post(AUTH_BACKEND_URL + "/verify", verifyobj).subscribe(
      (response: any) => {
        this.router.navigate(["/"]);
      },
      (error) => {
        this.authStatusListener.next(false);
      }
    );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.userdata = authInformation.userdata;
      this.isAuthenticated = true;

      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.userdata = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/auth/login"]);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(userdata: string, expirationDate: Date) {
    localStorage.setItem("userdata", JSON.stringify(userdata));
    localStorage.setItem("expiration", expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem("userdata");
    localStorage.removeItem("expiration");
  }

  private getAuthData() {
    const userdata = localStorage.getItem("userdata");
    const expirationDate = localStorage.getItem("expiration");
    if (!userdata || !expirationDate) {
      return;
    }
    return {
      userdata: userdata,
      expirationDate: new Date(expirationDate),
    };
  }
}
