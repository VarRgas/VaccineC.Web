import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class Interceptor implements HttpInterceptor {
 intercept( request: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {

  let token = localStorage.getItem('token');
  //Manda o token pro Back
  request = request.clone({
   setHeaders: {
     Authorization: 'Bearer ' + token
   }
  });
  return next.handle(request);
 }
}
