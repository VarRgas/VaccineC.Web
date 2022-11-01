import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { LoginService } from "./login.service";

@Injectable()
export class AuthorizeGuard implements CanActivate {

  constructor(
    private loginService: LoginService,
    private router: Router) {
  }

  public canActivate(): Observable<boolean> {
    return new Observable(observer => {
      let validLogin = this.loginService.validLogin();
      //Se o token n é valido redireciona pro Login.
      if (!validLogin) {
        this.router.navigateByUrl('/login');

        observer.next(validLogin);
				observer.complete();
      } else {
        observer.next(validLogin);
        observer.complete();
      }
    });
  }
}
